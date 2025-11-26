import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Valoracion } from './schemas/valoracion.schema';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class ValoracionesService {
  constructor(
    @InjectModel(Valoracion.name) private valoracionModel: Model<Valoracion>,
    private productosService: ProductosService,
  ) {}

  async crear(
    productoId: string,
    usuarioId: string,
    puntuacion: number,
    comentario?: string,
  ): Promise<Valoracion> {
    const valoracion = new this.valoracionModel({
      productoId,
      usuarioId,
      puntuacion,
      comentario,
    });

    const saved = await valoracion.save();

    // Actualizar promedio del producto
    await this.productosService.actualizarValoracion(productoId, puntuacion);

    return saved;
  }

  async obtenerPorProducto(productoId: string): Promise<Valoracion[]> {
    return this.valoracionModel.find({ productoId }).populate('usuarioId', 'nombre').exec();
  }
}
