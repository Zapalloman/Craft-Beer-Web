import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from './schemas/pedido.schema';
import { CarritoService } from '../carrito/carrito.service';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    private carritoService: CarritoService,
    private productosService: ProductosService,
  ) {}

  async crear(usuarioId: string, direccionId: string, metodoPago: string): Promise<Pedido> {
    // Usar el nuevo método que trae el carrito CON los items poblados
    const carritoConItems = await this.carritoService.obtenerCarritoConItems(usuarioId);

    if (!carritoConItems || !carritoConItems.items || carritoConItems.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const numeroOrden = `ORD-${Date.now()}`;

    const items = carritoConItems.items.map((item) => {
      // El productoId puede ser un objeto poblado o un ObjectId
      const producto = typeof item.productoId === 'object' ? item.productoId : null;
      const productoIdString = producto ? producto._id.toString() : item.productoId.toString();
      const nombreProducto = producto ? producto.nombre : 'Producto';

      return {
        productoId: productoIdString,
        nombreProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.precioUnitario * item.cantidad,
      };
    });

    // Calcular costo de envío
    const costoEnvio = carritoConItems.subtotal >= 15000 ? 0 : 2500;
    const totalConEnvio = carritoConItems.total + costoEnvio;

    // Verificar stock disponible antes de crear el pedido
    for (const item of carritoConItems.items) {
      const productoIdString = typeof item.productoId === 'object' 
        ? item.productoId._id.toString() 
        : item.productoId.toString();
      
      const producto = await this.productosService.findOne(productoIdString);
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
      }
    }

    const pedido = new this.pedidoModel({
      numeroOrden,
      usuarioId,
      direccionId,
      items,
      subtotal: carritoConItems.subtotal,
      iva: carritoConItems.iva,
      costoEnvio,
      total: totalConEnvio,
      metodoPago,
      estado: 'Procesando',
    });

    const pedidoGuardado = await pedido.save();

    // Descontar stock de cada producto
    for (const item of carritoConItems.items) {
      const productoIdString = typeof item.productoId === 'object' 
        ? item.productoId._id.toString() 
        : item.productoId.toString();
      
      // Descontar stock (cantidad negativa)
      await this.productosService.actualizarStock(productoIdString, -item.cantidad);
    }

    // Vaciar carrito
    await this.carritoService.vaciarCarrito(usuarioId);

    return pedidoGuardado;
  }

  async obtenerPedidos(usuarioId: string): Promise<Pedido[]> {
    return this.pedidoModel
      .find({ usuarioId })
      .sort({ fechaPedido: -1 })
      .exec();
  }

  async obtenerPedido(id: string): Promise<Pedido> {
    return this.pedidoModel.findById(id).exec();
  }

  async actualizarEstado(id: string, estado: string): Promise<Pedido> {
    return this.pedidoModel
      .findByIdAndUpdate(id, { estado }, { new: true })
      .exec();
  }

  // ==================== ADMIN ====================

  async obtenerTodosPedidos(
    estado?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<Pedido[]> {
    const filtro: any = {};
    
    if (estado) {
      filtro.estado = estado;
    }
    
    if (fechaInicio || fechaFin) {
      filtro.fechaPedido = {};
      if (fechaInicio) {
        filtro.fechaPedido.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        filtro.fechaPedido.$lte = new Date(fechaFin);
      }
    }
    
    return this.pedidoModel
      .find(filtro)
      .sort({ fechaPedido: -1 })
      .exec();
  }

  async obtenerEstadisticas(): Promise<any> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    const [totalPedidos, pedidosHoy, pedidosSemana, pedidosMes, pedidosPorEstado, ventasTotales] = await Promise.all([
      this.pedidoModel.countDocuments().exec(),
      this.pedidoModel.countDocuments({ fechaPedido: { $gte: hoy } }).exec(),
      this.pedidoModel.countDocuments({ fechaPedido: { $gte: inicioSemana } }).exec(),
      this.pedidoModel.countDocuments({ fechaPedido: { $gte: inicioMes } }).exec(),
      this.pedidoModel.aggregate([
        { $group: { _id: '$estado', count: { $sum: 1 } } }
      ]).exec(),
      this.pedidoModel.aggregate([
        { $match: { estado: { $ne: 'Cancelado' } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
      ]).exec(),
    ]);
    
    const estadosMap = pedidosPorEstado.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    return {
      totalPedidos,
      pedidosHoy,
      pedidosSemana,
      pedidosMes,
      pedidosPorEstado: estadosMap,
      ventasTotales: ventasTotales[0]?.total || 0,
      ticketPromedio: ventasTotales[0]?.count > 0 
        ? Math.round(ventasTotales[0].total / ventasTotales[0].count) 
        : 0,
    };
  }
}
