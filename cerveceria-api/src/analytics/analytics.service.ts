import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CarritoAbandonado,
  MotivoAbandono,
  EtapaAbandono,
} from './schemas/carrito-abandonado.schema';
import {
  EventoUsuario,
  TipoEvento,
  TipoEntidad,
} from './schemas/evento-usuario.schema';
import {
  EstadisticaProducto,
  PeriodoEstadistica,
} from './schemas/estadistica-producto.schema';
import {
  ReporteVentas,
  PeriodoReporte,
} from './schemas/reporte-ventas.schema';
import { RegistrarAbandonoDto } from './dto/registrar-abandono.dto';
import { RegistrarEventoDto } from './dto/registrar-evento.dto';
import { GenerarReporteDto } from './dto/generar-reporte.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(CarritoAbandonado.name)
    private carritoAbandonadoModel: Model<CarritoAbandonado>,
    @InjectModel(EventoUsuario.name)
    private eventoUsuarioModel: Model<EventoUsuario>,
    @InjectModel(EstadisticaProducto.name)
    private estadisticaProductoModel: Model<EstadisticaProducto>,
    @InjectModel(ReporteVentas.name)
    private reporteVentasModel: Model<ReporteVentas>,
  ) {}

  // ==================== CARRITOS ABANDONADOS ====================

  async registrarCarritoAbandonado(
    carritoId: string,
    usuarioId: string,
    dto: RegistrarAbandonoDto,
    carrito: any,
  ): Promise<CarritoAbandonado> {
    const abandonado = new this.carritoAbandonadoModel({
      carritoId: new Types.ObjectId(carritoId),
      usuarioId: usuarioId ? new Types.ObjectId(usuarioId) : null,
      items: carrito.items.map((item: any) => ({
        productoId: item.productoId,
        nombreProducto: item.nombreProducto || 'Producto',
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      })),
      subtotal: carrito.subtotal,
      total: carrito.total,
      fechaCreacion: carrito.createdAt || new Date(),
      fechaAbandono: new Date(),
      motivoAbandono: dto.motivoAbandono || MotivoAbandono.DESCONOCIDO,
      etapaAbandono: dto.etapaAbandono,
      dispositivoUsado: dto.dispositivoUsado,
      navegador: dto.navegador,
      metadatos: dto.metadatos,
    });

    return await abandonado.save();
  }

  async obtenerCarritosAbandonados(
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<CarritoAbandonado[]> {
    const filtro: any = {};

    if (fechaInicio || fechaFin) {
      filtro.fechaAbandono = {};
      if (fechaInicio) filtro.fechaAbandono.$gte = fechaInicio;
      if (fechaFin) filtro.fechaAbandono.$lte = fechaFin;
    }

    return await this.carritoAbandonadoModel
      .find(filtro)
      .populate('usuarioId', 'nombre email')
      .sort({ fechaAbandono: -1 })
      .exec();
  }

  async obtenerEstadisticasAbandono(): Promise<any> {
    const totalAbandonados = await this.carritoAbandonadoModel.countDocuments();

    const porMotivo = await this.carritoAbandonadoModel.aggregate([
      {
        $group: {
          _id: '$motivoAbandono',
          cantidad: { $sum: 1 },
          promedioTotal: { $avg: '$total' },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    const porEtapa = await this.carritoAbandonadoModel.aggregate([
      {
        $group: {
          _id: '$etapaAbandono',
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    const valorPerdido = await this.carritoAbandonadoModel.aggregate([
      {
        $group: {
          _id: null,
          totalPerdido: { $sum: '$total' },
          promedioPerdido: { $avg: '$total' },
        },
      },
    ]);

    return {
      totalAbandonados,
      porMotivo,
      porEtapa,
      valorPerdido: valorPerdido[0] || { totalPerdido: 0, promedioPerdido: 0 },
    };
  }

  async obtenerMotivosAbandono(): Promise<any[]> {
    return await this.carritoAbandonadoModel.aggregate([
      {
        $group: {
          _id: '$motivoAbandono',
          cantidad: { $sum: 1 },
          porcentaje: { $avg: 1 },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);
  }

  // ==================== EVENTOS DE USUARIO ====================

  async registrarEvento(
    usuarioId: string | null,
    dto: RegistrarEventoDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<EventoUsuario> {
    const evento = new this.eventoUsuarioModel({
      usuarioId: usuarioId ? new Types.ObjectId(usuarioId) : null,
      tipoEvento: dto.tipoEvento,
      entidad: dto.entidad,
      entidadId: dto.entidadId ? new Types.ObjectId(dto.entidadId) : null,
      accion: dto.accion,
      datosAdicionales: dto.datosAdicionales,
      dispositivo: dto.dispositivo,
      navegador: dto.navegador,
      ipAddress,
      userAgent,
      fecha: new Date(),
      sesionId: dto.sesionId,
    });

    return await evento.save();
  }

  async obtenerEventosPorUsuario(
    usuarioId: string,
    limite: number = 100,
  ): Promise<EventoUsuario[]> {
    return await this.eventoUsuarioModel
      .find({ usuarioId: new Types.ObjectId(usuarioId) })
      .sort({ fecha: -1 })
      .limit(limite)
      .exec();
  }

  async obtenerEventosPorTipo(
    tipoEvento: TipoEvento,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<EventoUsuario[]> {
    const filtro: any = { tipoEvento };

    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = fechaInicio;
      if (fechaFin) filtro.fecha.$lte = fechaFin;
    }

    return await this.eventoUsuarioModel
      .find(filtro)
      .sort({ fecha: -1 })
      .limit(1000)
      .exec();
  }

  async obtenerResumenEventos(
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<any> {
    const filtro: any = {};

    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = fechaInicio;
      if (fechaFin) filtro.fecha.$lte = fechaFin;
    }

    const resumen = await this.eventoUsuarioModel.aggregate([
      { $match: filtro },
      {
        $group: {
          _id: '$tipoEvento',
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    const totalEventos = await this.eventoUsuarioModel.countDocuments(filtro);

    return {
      totalEventos,
      porTipo: resumen,
    };
  }

  // ==================== ESTADÍSTICAS DE PRODUCTOS ====================

  async calcularEstadisticasProducto(
    productoId: string,
    periodo: PeriodoEstadistica,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<EstadisticaProducto> {
    const productoObjectId = new Types.ObjectId(productoId);

    // Calcular vistas
    const totalVistas = await this.eventoUsuarioModel.countDocuments({
      tipoEvento: TipoEvento.PRODUCTO_VISTO,
      entidadId: productoObjectId,
      fecha: { $gte: fechaInicio, $lte: fechaFin },
    });

    // Calcular agregados al carrito
    const totalCarritoAgregado = await this.eventoUsuarioModel.countDocuments({
      tipoEvento: TipoEvento.PRODUCTO_AGREGADO_CARRITO,
      entidadId: productoObjectId,
      fecha: { $gte: fechaInicio, $lte: fechaFin },
    });

    // Calcular carritos abandonados con este producto
    const totalCarritoAbandonado = await this.carritoAbandonadoModel.countDocuments(
      {
        'items.productoId': productoObjectId,
        fechaAbandono: { $gte: fechaInicio, $lte: fechaFin },
      },
    );

    // Tasa de conversión
    const tasaConversion = totalVistas > 0 ? (totalCarritoAgregado / totalVistas) * 100 : 0;

    // Buscar o crear estadística
    const estadistica = await this.estadisticaProductoModel.findOneAndUpdate(
      {
        productoId: productoObjectId,
        periodo,
        fechaInicio,
        fechaFin,
      },
      {
        totalVistas,
        totalCarritoAgregado,
        totalCarritoAbandonado,
        tasaConversion: Number(tasaConversion.toFixed(2)),
        fechaActualizacion: new Date(),
      },
      { new: true, upsert: true },
    );

    return estadistica;
  }

  async obtenerProductosMasVendidos(limite: number = 10): Promise<any[]> {
    return await this.estadisticaProductoModel
      .find()
      .sort({ totalVentas: -1 })
      .limit(limite)
      .populate('productoId', 'nombre precio categoria')
      .exec();
  }

  async obtenerProductosMenosVendidos(limite: number = 10): Promise<any[]> {
    return await this.estadisticaProductoModel
      .find({ totalVentas: { $gt: 0 } })
      .sort({ totalVentas: 1 })
      .limit(limite)
      .populate('productoId', 'nombre precio categoria')
      .exec();
  }

  async obtenerTendenciasProductos(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<any[]> {
    return await this.estadisticaProductoModel
      .find({
        fechaInicio: { $gte: fechaInicio },
        fechaFin: { $lte: fechaFin },
      })
      .sort({ tasaConversion: -1 })
      .limit(20)
      .populate('productoId', 'nombre precio categoria')
      .exec();
  }

  // ==================== REPORTES DE VENTAS ====================

  async generarReporteVentas(dto: GenerarReporteDto): Promise<ReporteVentas> {
    const { fechaInicio, fechaFin } = this.calcularRangoFechas(
      dto.periodo,
      dto.fechaInicio,
      dto.fechaFin,
    );

    // Aquí deberías agregar lógica para calcular métricas reales desde pedidos
    // Por ahora, creo una estructura básica

    const reporte = new this.reporteVentasModel({
      periodo: dto.periodo,
      fechaInicio,
      fechaFin,
      fechaGeneracion: new Date(),
      // Estas métricas deberían calcularse desde la colección de Pedidos
      totalVentas: 0,
      totalIngresos: 0,
      ticketPromedio: 0,
      totalClientes: 0,
      clientesNuevos: 0,
      clientesRecurrentes: 0,
      productosMasVendidos: [],
      categoriasMasVendidas: [],
      totalCarritosCreados: 0,
      totalCarritosAbandonados: 0,
      tasaAbandonoCarrito: 0,
      tasaConversionGeneral: 0,
    });

    return await reporte.save();
  }

  async obtenerReportePorPeriodo(
    periodo: PeriodoReporte,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<ReporteVentas> {
    const filtro: any = { periodo };

    if (fechaInicio && fechaFin) {
      filtro.fechaInicio = { $gte: fechaInicio };
      filtro.fechaFin = { $lte: fechaFin };
    }

    const reporte = await this.reporteVentasModel
      .findOne(filtro)
      .sort({ fechaGeneracion: -1 })
      .exec();

    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado para el periodo especificado');
    }

    return reporte;
  }

  async compararPeriodos(
    periodo1: { inicio: Date; fin: Date },
    periodo2: { inicio: Date; fin: Date },
  ): Promise<any> {
    const reporte1 = await this.reporteVentasModel
      .findOne({
        fechaInicio: periodo1.inicio,
        fechaFin: periodo1.fin,
      })
      .exec();

    const reporte2 = await this.reporteVentasModel
      .findOne({
        fechaInicio: periodo2.inicio,
        fechaFin: periodo2.fin,
      })
      .exec();

    if (!reporte1 || !reporte2) {
      throw new NotFoundException('Uno o ambos reportes no encontrados');
    }

    return {
      periodo1: reporte1,
      periodo2: reporte2,
      comparacion: {
        ventasDiferencia: reporte1.totalVentas - reporte2.totalVentas,
        ventasPorcentaje:
          ((reporte1.totalVentas - reporte2.totalVentas) / reporte2.totalVentas) * 100,
        ingresosDiferencia: reporte1.totalIngresos - reporte2.totalIngresos,
        ingresosPorcentaje:
          ((reporte1.totalIngresos - reporte2.totalIngresos) / reporte2.totalIngresos) * 100,
      },
    };
  }

  async obtenerInsights(): Promise<any> {
    const productosMasVendidos = await this.obtenerProductosMasVendidos(5);
    const estadisticasAbandono = await this.obtenerEstadisticasAbandono();
    const resumenEventos = await this.obtenerResumenEventos();

    return {
      productosMasVendidos,
      estadisticasAbandono,
      resumenEventos,
      recomendaciones: this.generarRecomendaciones(
        estadisticasAbandono,
        productosMasVendidos,
      ),
    };
  }

  // ==================== MÉTODOS AUXILIARES ====================

  private calcularRangoFechas(
    periodo: PeriodoReporte,
    fechaInicio?: string,
    fechaFin?: string,
  ): { fechaInicio: Date; fechaFin: Date } {
    const ahora = new Date();

    if (periodo === PeriodoReporte.PERSONALIZADO && fechaInicio && fechaFin) {
      return {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      };
    }

    let inicio: Date;
    let fin: Date = ahora;

    switch (periodo) {
      case PeriodoReporte.DIARIO:
        inicio = new Date(ahora);
        inicio.setHours(0, 0, 0, 0);
        break;
      case PeriodoReporte.SEMANAL:
        inicio = new Date(ahora);
        inicio.setDate(ahora.getDate() - 7);
        break;
      case PeriodoReporte.MENSUAL:
        inicio = new Date(ahora);
        inicio.setMonth(ahora.getMonth() - 1);
        break;
      case PeriodoReporte.TRIMESTRAL:
        inicio = new Date(ahora);
        inicio.setMonth(ahora.getMonth() - 3);
        break;
      case PeriodoReporte.ANUAL:
        inicio = new Date(ahora);
        inicio.setFullYear(ahora.getFullYear() - 1);
        break;
      default:
        inicio = new Date(ahora);
        inicio.setMonth(ahora.getMonth() - 1);
    }

    return { fechaInicio: inicio, fechaFin: fin };
  }

  private generarRecomendaciones(
    estadisticasAbandono: any,
    productosMasVendidos: any[],
  ): string[] {
    const recomendaciones: string[] = [];

    if (estadisticasAbandono.totalAbandonados > 0) {
      const motivoPrincipal = estadisticasAbandono.porMotivo[0];
      if (motivoPrincipal?._id === MotivoAbandono.PRECIO_ALTO) {
        recomendaciones.push(
          'Considerar implementar descuentos o promociones para reducir abandono por precio alto',
        );
      }
      if (motivoPrincipal?._id === MotivoAbandono.COSTO_ENVIO) {
        recomendaciones.push(
          'Ofrecer envío gratis en compras superiores a cierto monto',
        );
      }
    }

    if (productosMasVendidos.length > 0) {
      recomendaciones.push(
        'Destacar los productos más vendidos en la página principal',
      );
    }

    return recomendaciones;
  }
}
