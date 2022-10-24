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

  async getAllProducts(){
    return this.products;
  }

  async getProductById(productId){
    const product = this.products.find(product => product.id === productId);
    if (product) {
      return {
        message: 'Product founded',
        data: product
      }
    }else{
      throw new Error('Producto no encontrado... productId: ' + productId);
    }
  }

  async postOneProduct(body){
    let product = {
      id: faker.datatype.uuid(),
      name: body.name,
      price: body.price,
      Image: body.Image
    }
    if (Object.keys(body).length != 0) {

      this.products.push(product);
      return {
        message: 'Product created successfully',
        data: product
      }
    }else{
      throw new Error('Debes poner un body en formato JSON');
    }
  }

  async patchOneProduct(productId, body){
    let index = this.products.findIndex(product => product.id === productId);
    if (index != -1) {
      const product = this.products[index];
      this.products[index] = {
        ...product, //merge data in JSON
        ...body //merge data in JSON
      };
      return {
        Message: 'Product updated successfully',
        data: {
          ...product,
          ...body
        }
      };
    }else{
      throw new Error('Product: ' + productId + ' not found');
    }
  }

  async deleteProduct(productId){
    let product = this.products.find(product => product.id === productId);
    const productIndex = this.products.indexOf(product);
    if (product) {
      this.products.splice(productIndex, 1);
      return {
        message: 'Product deleted successfully',
        product
      }
    }else{
      return { ErrorMessage: 'Product: ' + productId + ' not found' };
    }
  }

}

module.exports = ProductsServices;
