import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RegistrarAbandonoDto } from './dto/registrar-abandono.dto';
import { RegistrarEventoDto } from './dto/registrar-evento.dto';
import { GenerarReporteDto } from './dto/generar-reporte.dto';
import { TipoEvento } from './schemas/evento-usuario.schema';
import { PeriodoReporte } from './schemas/reporte-ventas.schema';
import { PeriodoEstadistica } from './schemas/estadistica-producto.schema';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ==================== EVENTOS ====================

  @Post('eventos')
  async registrarEvento(
    @Body() dto: RegistrarEventoDto,
    @Request() req: any,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const usuarioId = req.user?.userId || null;
    const evento = await this.analyticsService.registrarEvento(
      usuarioId,
      dto,
      ip,
      userAgent,
    );

    return {
      message: 'Evento registrado exitosamente',
      evento,
    };
  }

  @Get('eventos/usuario/:usuarioId')
  async obtenerEventosUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('limite') limite?: number,
  ) {
    const eventos = await this.analyticsService.obtenerEventosPorUsuario(
      usuarioId,
      limite || 100,
    );

    return {
      total: eventos.length,
      eventos,
    };
  }

  @Get('eventos/tipo/:tipoEvento')
  async obtenerEventosPorTipo(
    @Param('tipoEvento') tipoEvento: TipoEvento,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;

    const eventos = await this.analyticsService.obtenerEventosPorTipo(
      tipoEvento,
      inicio,
      fin,
    );

    return {
      tipoEvento,
      total: eventos.length,
      eventos,
    };
  }

  @Get('eventos/resumen')
  async obtenerResumenEventos(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;

    return await this.analyticsService.obtenerResumenEventos(inicio, fin);
  }

  // ==================== CARRITOS ABANDONADOS ====================

  @Post('carritos-abandonados/:carritoId')
  async registrarAbandonoCarrito(
    @Param('carritoId') carritoId: string,
    @Body() dto: RegistrarAbandonoDto,
    @Request() req: any,
  ) {
    const usuarioId = req.user?.userId;
    // Aquí deberías obtener el carrito completo desde CarritoService
    // Por simplicidad, asumo que el carrito se pasa en el dto o se obtiene del servicio
    const carrito = {
      items: [],
      subtotal: 0,
      total: 0,
    };

    const abandonado = await this.analyticsService.registrarCarritoAbandonado(
      carritoId,
      usuarioId,
      dto,
      carrito,
    );

    return {
      message: 'Carrito abandonado registrado exitosamente',
      abandonado,
    };
  }

  @Get('carritos-abandonados')
  async obtenerCarritosAbandonados(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;

    const carritos = await this.analyticsService.obtenerCarritosAbandonados(
      inicio,
      fin,
    );

    return {
      total: carritos.length,
      carritos,
    };
  }

  @Get('carritos-abandonados/estadisticas')
  async obtenerEstadisticasAbandono() {
    return await this.analyticsService.obtenerEstadisticasAbandono();
  }

  @Get('carritos-abandonados/motivos')
  async obtenerMotivosAbandono() {
    const motivos = await this.analyticsService.obtenerMotivosAbandono();

    return {
      total: motivos.length,
      motivos,
    };
  }

  // ==================== ESTADÍSTICAS DE PRODUCTOS ====================

  @Post('productos/:productoId/calcular')
  async calcularEstadisticasProducto(
    @Param('productoId') productoId: string,
    @Query('periodo') periodo: PeriodoEstadistica,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const estadistica = await this.analyticsService.calcularEstadisticasProducto(
      productoId,
      periodo,
      inicio,
      fin,
    );

    return {
      message: 'Estadísticas calculadas exitosamente',
      estadistica,
    };
  }

  @Get('productos/mas-vendidos')
  async obtenerProductosMasVendidos(@Query('limite') limite?: number) {
    const productos = await this.analyticsService.obtenerProductosMasVendidos(
      limite || 10,
    );

    return {
      total: productos.length,
      productos,
    };
  }

  @Get('productos/menos-vendidos')
  async obtenerProductosMenosVendidos(@Query('limite') limite?: number) {
    const productos = await this.analyticsService.obtenerProductosMenosVendidos(
      limite || 10,
    );

    return {
      total: productos.length,
      productos,
    };
  }

  @Get('productos/tendencias')
  async obtenerTendenciasProductos(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const tendencias = await this.analyticsService.obtenerTendenciasProductos(
      inicio,
      fin,
    );

    return {
      total: tendencias.length,
      tendencias,
    };
  }

  // ==================== REPORTES DE VENTAS ====================

  @Post('reportes/generar')
  async generarReporte(@Body() dto: GenerarReporteDto) {
    const reporte = await this.analyticsService.generarReporteVentas(dto);

    return {
      message: 'Reporte generado exitosamente',
      reporte,
    };
  }

  @Get('reportes/periodo/:periodo')
  async obtenerReportePorPeriodo(
    @Param('periodo') periodo: PeriodoReporte,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;

    const reporte = await this.analyticsService.obtenerReportePorPeriodo(
      periodo,
      inicio,
      fin,
    );

    return {
      reporte,
    };
  }

  @Post('reportes/comparar')
  async compararPeriodos(
    @Body()
    body: {
      periodo1: { inicio: string; fin: string };
      periodo2: { inicio: string; fin: string };
    },
  ) {
    const periodo1 = {
      inicio: new Date(body.periodo1.inicio),
      fin: new Date(body.periodo1.fin),
    };

    const periodo2 = {
      inicio: new Date(body.periodo2.inicio),
      fin: new Date(body.periodo2.fin),
    };

    return await this.analyticsService.compararPeriodos(periodo1, periodo2);
  }

  @Get('insights')
  async obtenerInsights() {
    return await this.analyticsService.obtenerInsights();
  }

  // ==================== DASHBOARD ====================

  @Get('dashboard')
  async obtenerDashboard() {
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      productosMasVendidos,
      estadisticasAbandono,
      resumenEventos,
      insights,
    ] = await Promise.all([
      this.analyticsService.obtenerProductosMasVendidos(5),
      this.analyticsService.obtenerEstadisticasAbandono(),
      this.analyticsService.obtenerResumenEventos(hace30Dias, hoy),
      this.analyticsService.obtenerInsights(),
    ]);

    return {
      periodo: {
        inicio: hace30Dias,
        fin: hoy,
      },
      productosMasVendidos,
      estadisticasAbandono,
      resumenEventos,
      insights,
    };
  }
}
