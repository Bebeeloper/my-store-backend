const faker = require('faker');

class ProductsServices {

  constructor(){
    this.products = [];
    this.generateProducts();
  }

  generateProducts(){
    const limit = 100;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        price: parseInt(faker.commerce.price(), 10),
        Image: faker.image.imageUrl()
      })
    }
  }

  getAllProducts(){
    return this.products;
  }

  getProductById(productId){
    const product = this.products.find(product => product.id === productId);
    let productById;
    if (product) {
      productById = product;
    }else{
      productById = {
        message: 'Producto no encontrado... productId: ' + productId
      }
    }

    return productById;
  }

  postOneProduct(body){
    const product = {
      id: faker.datatype.uuid(),
      name: body.name,
      price: body.price,
      Image: body.Image
    }
    this.products.push(product);
    return product
  }

  patchOneProduct(productId, body){
    let product = this.products.find(product => product.id === productId);
    if (product) {
      if (body.name) {
        product.name = body.name;
      }
      if (body.price) {
        product.price = body.price;
      }
      return product;
    }else{
      product = ''
      return product
    }
  }

}

module.exports = ProductsServices;
