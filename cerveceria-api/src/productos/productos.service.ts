import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto } from './schemas/producto.schema';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private productoModel: Model<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = new this.productoModel(createProductoDto);
    return producto.save();
  }

  async findAll(filtros?: {
    tipo?: string;
    precioMin?: number;
    precioMax?: number;
    abvMin?: number;
    abvMax?: number;
  }): Promise<Producto[]> {
    const query: any = { activo: true };

    if (filtros?.tipo) {
      query.tipo = filtros.tipo;
    }

    if (filtros?.precioMin || filtros?.precioMax) {
      query.precio = {};
      if (filtros.precioMin) query.precio.$gte = filtros.precioMin;
      if (filtros.precioMax) query.precio.$lte = filtros.precioMax;
    }

    if (filtros?.abvMin || filtros?.abvMax) {
      query.abv = {};
      if (filtros.abvMin) query.abv.$gte = filtros.abvMin;
      if (filtros.abvMax) query.abv.$lte = filtros.abvMax;
    }

    return this.productoModel.find(query).sort({ nombre: 1 }).exec();
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoModel.findById(id).exec();
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async buscar(termino: string): Promise<Producto[]> {
    return this.productoModel
      .find({
        activo: true,
        $or: [
          { nombre: { $regex: termino, $options: 'i' } },
          { descripcion: { $regex: termino, $options: 'i' } },
          { tipo: { $regex: termino, $options: 'i' } },
        ],
      })
      .exec();
  }

  async update(
    id: string,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.productoModel
      .findByIdAndUpdate(id, updateProductoDto, { new: true })
      .exec();

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async actualizarStock(id: string, cantidad: number): Promise<Producto> {
    const producto = await this.findOne(id);

    if (producto.stock + cantidad < 0) {
      throw new Error('Stock insuficiente');
    }

    producto.stock += cantidad;
    return producto.save();
  }

  async actualizarValoracion(
    id: string,
    nuevaPuntuacion: number,
  ): Promise<void> {
    const producto = await this.findOne(id);

    const totalPuntuacion =
      producto.valoracionPromedio * producto.numeroValoraciones +
      nuevaPuntuacion;
    producto.numeroValoraciones += 1;
    producto.valoracionPromedio = totalPuntuacion / producto.numeroValoraciones;

    await producto.save();
  }

  async remove(id: string): Promise<Producto> {
    // Soft delete
    return this.update(id, { activo: false });
  }
}
