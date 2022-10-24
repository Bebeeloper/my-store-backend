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
    if (product) {
      return {
        message: 'Product founded',
        data: product
      }
    }else{
      return {message: 'Producto no encontrado... productId: ' + productId};
    }
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
        message: 'Product created successfully',
        data: product
      }
    }else{
      return {ErrorMessage: 'Debes poner un body en formato JSON'};
    }
  }

  patchOneProduct(productId, body){
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
      return { ErrorMessage: 'Product: ' + productId + ' not found' };
    }

    // if (index != -1) {
    //   const product = this.products[index];
    //   this.products[index] = {
    //     ...product, //merge data in JSON
    //     ...body //merge data in JSON
    //   };
    //   return product;
    // }else{
    //   return { ErrorMessage: 'Product: ' + productId + ' not found' };
    // }
    // if (product) {
    //   if (body.name) {
    //     product.name = body.name;
    //   }
    //   if (body.price) {
    //     product.price = body.price;
    //   }
    //   return {
    //     message: 'Product updated successfully',
    //     data: product
    //   }
    // }else{
    //   return { ErrorMessage: 'Product: ' + productId + ' not found' };
    // }
  }

  deleteProduct(productId){
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
