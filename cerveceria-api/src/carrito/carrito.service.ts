import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Carrito } from './schemas/carrito.schema';
import { ItemCarrito } from './schemas/item-carrito.schema';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class CarritoService {
  constructor(
    @InjectModel(Carrito.name) private carritoModel: Model<Carrito>,
    @InjectModel(ItemCarrito.name) private itemCarritoModel: Model<ItemCarrito>,
    private productosService: ProductosService,
  ) {}

  async obtenerCarrito(usuarioId: string): Promise<Carrito> {
    console.log('🔍 Buscando carrito para usuarioId:', usuarioId, 'tipo:', typeof usuarioId);
    let carrito = await this.carritoModel.findOne({ usuarioId }).exec();

    if (!carrito) {
      console.log('📝 Creando nuevo carrito para:', usuarioId);
      carrito = new this.carritoModel({ usuarioId });
      await carrito.save();
      console.log('✅ Carrito creado con ID:', carrito._id);
    } else {
      console.log('♻️ Carrito existente encontrado:', carrito._id);
    }

    return carrito;
  }

  async obtenerItemsCarrito(carritoId: string): Promise<ItemCarrito[]> {
    console.log('🔍 Buscando items para carritoId:', carritoId);
    const items = await this.itemCarritoModel
      .find({ carritoId: new Types.ObjectId(carritoId) })
      .populate('productoId', 'nombre precio categoria imagen tipo')
      .exec();
    console.log('📦 Items encontrados:', items.length);
    if (items.length > 0) {
      console.log('📦 Primer item:', items[0]);
    }
    return items;
  }

  async obtenerCarritoConItems(usuarioId: string): Promise<any> {
    const carrito = await this.obtenerCarrito(usuarioId);
    console.log('🛒 Carrito encontrado:', carrito._id);
    
    // Recalcular totales para asegurar que estén actualizados
    const carritoActualizado = await this.recalcularTotales(carrito._id.toString());
    const items = await this.obtenerItemsCarrito(carrito._id.toString());

    return {
      ...carritoActualizado.toObject(),
      items,
    };
  }

  async agregarItem(
    usuarioId: string,
    productoId: string,
    cantidad: number,
  ): Promise<Carrito> {
    try {
      console.log('📝 Agregando item:', { usuarioId, productoId, cantidad });
      const producto = await this.productosService.findOne(productoId);
      const carrito = await this.obtenerCarrito(usuarioId);

      console.log('🔍 Buscando item existente con carritoId:', carrito._id.toString(), 'productoId:', productoId);
      
      // Verificar si el item ya existe - convertir IDs a ObjectId
      const itemExistente = await this.itemCarritoModel.findOne({
        carritoId: new Types.ObjectId(carrito._id.toString()),
        productoId: new Types.ObjectId(productoId),
      }).exec();

      if (itemExistente) {
        console.log('✅ Item ya existe, actualizando cantidad');
        // Actualizar cantidad del item existente
        itemExistente.cantidad += cantidad;
        itemExistente.subtotal = itemExistente.precioUnitario * itemExistente.cantidad;
        await itemExistente.save();
        console.log('✅ Item actualizado');
      } else {
        console.log('✅ Creando nuevo item');
        // Crear nuevo item
        const nuevoItem = new this.itemCarritoModel({
          carritoId: carrito._id,
          productoId: producto._id,
          cantidad,
          precioUnitario: producto.precio,
          subtotal: producto.precio * cantidad,
        });
        await nuevoItem.save();
        console.log('✅ Nuevo item guardado:', {
          carritoId: nuevoItem.carritoId,
          productoId: nuevoItem.productoId,
          cantidad: nuevoItem.cantidad
        });
      }

      await this.recalcularTotales(carrito._id.toString());
      return this.obtenerCarritoConItems(usuarioId);
    } catch (error) {
      console.error('❌ Error al agregar item al carrito:', error.message);
      throw error;
    }
  }  async actualizarCantidad(
    usuarioId: string,
    productoId: string,
    cantidad: number,
  ): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(usuarioId);

    const item = await this.itemCarritoModel.findOne({
      carritoId: new Types.ObjectId(carrito._id.toString()),
      productoId: new Types.ObjectId(productoId),
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    if (cantidad <= 0) {
      // Si la cantidad es 0 o negativa, eliminar el item
      await this.itemCarritoModel.deleteOne({ _id: item._id });
    } else {
      // Actualizar cantidad
      item.cantidad = cantidad;
      item.subtotal = item.precioUnitario * cantidad;
      await item.save();
    }

    await this.recalcularTotales(carrito._id.toString());
    return this.obtenerCarritoConItems(usuarioId);
  }

  async eliminarItem(usuarioId: string, productoId: string): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(usuarioId);

    const resultado = await this.itemCarritoModel.deleteOne({
      carritoId: new Types.ObjectId(carrito._id.toString()),
      productoId: new Types.ObjectId(productoId),
    });

    if (resultado.deletedCount === 0) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    await this.recalcularTotales(carrito._id.toString());
    return this.obtenerCarritoConItems(usuarioId);
  }

  async vaciarCarrito(usuarioId: string): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(usuarioId);

    // Eliminar todos los items del carrito
    await this.itemCarritoModel.deleteMany({ carritoId: carrito._id });

    await this.recalcularTotales(carrito._id.toString());
    return this.obtenerCarritoConItems(usuarioId);
  }

  private async recalcularTotales(carritoId: string): Promise<Carrito> {
    const carrito = await this.carritoModel.findById(carritoId);

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    // Obtener todos los items del carrito - usar ObjectId para la búsqueda
    const items = await this.itemCarritoModel.find({ 
      carritoId: new Types.ObjectId(carritoId) 
    });

    // Calcular totales
    carrito.subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    carrito.iva = Math.round(carrito.subtotal * 0.19); // 19% IVA Chile
    carrito.total = carrito.subtotal + carrito.iva;
    carrito.cantidadItems = items.length;

    return carrito.save();
  }
}

