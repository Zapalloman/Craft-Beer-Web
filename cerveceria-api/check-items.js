const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cerveceria-craft-beer')
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    
    const ItemCarrito = mongoose.model('ItemCarrito', new mongoose.Schema({}, { strict: false, collection: 'itemcarritos' }));
    const Carrito = mongoose.model('Carrito', new mongoose.Schema({}, { strict: false, collection: 'carritos' }));
    
    const carritos = await Carrito.find();
    console.log('\n📦 CARRITOS:');
    carritos.forEach(c => console.log(`  - ID: ${c._id}, Usuario: ${c.usuarioId}`));
    
    const items = await ItemCarrito.find();
    console.log(`\n🛒 ITEMS EN CARRITO (${items.length}):`);
    items.forEach(item => {
      console.log(`  - CarritoID: ${item.carritoId}, ProductoID: ${item.productoId}, Cantidad: ${item.cantidad}`);
    });
    
    // Buscar específicamente el carrito del usuario
    const usuarioId = '6925e9f436882cf9fe29a698';
    const carritoUsuario = await Carrito.findOne({ usuarioId });
    console.log(`\n🔍 Carrito del usuario ${usuarioId}:`);
    console.log(carritoUsuario);
    
    if (carritoUsuario) {
      const itemsUsuario = await ItemCarrito.find({ carritoId: carritoUsuario._id });
      console.log(`\n📦 Items en el carrito del usuario (${itemsUsuario.length}):`);
      itemsUsuario.forEach(item => {
        console.log(`  - ProductoID: ${item.productoId}, Cantidad: ${item.cantidad}`);
      });
    }
    
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
