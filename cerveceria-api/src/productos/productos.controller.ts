import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

// Configuración de almacenamiento para multer
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(__dirname, '..', '..', 'uploads', 'productos');
    // Crear carpeta si no existe
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-randomstring.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `producto-${uniqueSuffix}${ext}`);
  },
});

// Filtro para solo permitir imágenes
const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new BadRequestException('Solo se permiten archivos de imagen'), false);
  }
  cb(null, true);
};

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto (Admin)' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Post('upload-imagen')
  @ApiOperation({ summary: 'Subir imagen de producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imagen: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
    }),
  )
  async uploadImagen(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }
    // Retornar la URL de la imagen
    return {
      url: `http://localhost:3000/uploads/productos/${file.filename}`,
      filename: file.filename,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos con filtros opcionales' })
  @ApiQuery({ name: 'tipo', required: false, enum: ['IPA', 'Stout', 'Lager', 'Porter', 'Ale'] })
  @ApiQuery({ name: 'precioMin', required: false, type: Number })
  @ApiQuery({ name: 'precioMax', required: false, type: Number })
  @ApiQuery({ name: 'abvMin', required: false, type: Number })
  @ApiQuery({ name: 'abvMax', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  findAll(
    @Query('tipo') tipo?: string,
    @Query('precioMin') precioMin?: number,
    @Query('precioMax') precioMax?: number,
    @Query('abvMin') abvMin?: number,
    @Query('abvMax') abvMax?: number,
  ) {
    return this.productosService.findAll({
      tipo,
      precioMin: precioMin ? Number(precioMin) : undefined,
      precioMax: precioMax ? Number(precioMax) : undefined,
      abvMin: abvMin ? Number(abvMin) : undefined,
      abvMax: abvMax ? Number(abvMax) : undefined,
    });
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar productos por nombre o descripción' })
  @ApiQuery({ name: 'q', required: true, description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  buscar(@Query('q') termino: string) {
    return this.productosService.buscar(termino);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un producto' })
  @ApiResponse({ status: 200, description: 'Detalle del producto' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto (Admin)' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto (Admin)' })
  @ApiResponse({ status: 200, description: 'Producto eliminado (soft delete)' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }
}
