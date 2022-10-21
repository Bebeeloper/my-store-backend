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
    // let productById;
    if (product) {
      // productById = product;
      return {
        message: 'Product founded',
        data: product
      }
    }else{
      return {message: 'Producto no encontrado... productId: ' + productId};
      // productById = {
      //   message: 'Producto no encontrado... productId: ' + productId
      // }
    }

    // return productById;
  }

  postOneProduct(body){
    let product = {
      id: faker.datatype.uuid(),
      name: body.name,
      price: body.price,
      Image: body.Image
    }
    if (Object.keys(body).length != 0) {

      this.products.push(product);
      return {
        message: 'Product created sucessfully',
        data: product
      }
    }else{
      return {ErrorMessage: 'Debes poner un body en formato JSON'};
    }
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
      return {
        message: 'Product updated sucessfully',
        data: product
      }
    }else{
      return { ErrorMessage: 'Product: ' + productId + ' not found' };
    }
  }

  deleteProduct(productId){
    let product = this.products.find(product => product.id === productId);
    const productIndex = this.products.indexOf(product);
    if (product) {
      this.products.splice(productIndex, 1);
      return {
        message: 'Product delected sucessfully',
        product
      }
    }else{
      return { ErrorMessage: 'Product: ' + productId + ' not found' };
    }
  }

}

module.exports = ProductsServices;
