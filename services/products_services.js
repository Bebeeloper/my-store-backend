const faker = require('faker');

class ProductsServices {

  products = [{
    refId: faker.datatype.uuid(),
    ref: '0001',
    name: 'Gorra',
    cost: 25000,
    price: 35000,
    image: faker.image.imageUrl()
  },
  {
    refId: faker.datatype.uuid(),
    ref: '0002',
    name: 'Camiseta',
    cost: 35000,
    price: 50000,
    image: faker.image.imageUrl()
  },{
    refId: faker.datatype.uuid(),
    ref: '0001',
    name: 'Gorra',
    cost: 25000,
    price: 35000,
    image: faker.image.imageUrl()
  },
  {
    refId: faker.datatype.uuid(),
    ref: '0002',
    name: 'Camiseta',
    cost: 35000,
    price: 50000,
    image: faker.image.imageUrl()
  },{
    refId: faker.datatype.uuid(),
    ref: '0001',
    name: 'Gorra',
    cost: 25000,
    price: 35000,
    image: faker.image.imageUrl()
  },
  {
    refId: faker.datatype.uuid(),
    ref: '0002',
    name: 'Camiseta',
    cost: 35000,
    price: 50000,
    image: faker.image.imageUrl()
  },{
    refId: faker.datatype.uuid(),
    ref: '0001',
    name: 'Gorra',
    cost: 25000,
    price: 35000,
    image: faker.image.imageUrl()
  },
  {
    refId: faker.datatype.uuid(),
    ref: '0002',
    name: 'Camiseta',
    cost: 35000,
    price: 50000,
    image: faker.image.imageUrl()
  }];

  constructor(){

  }

  getAllProducts(){
    return this.products;
  }

  getProductByName(productName){
    const product = this.products.filter(product => product.name.toLowerCase().includes(productName.toLowerCase()));

    if (product) {
      return {
        message: 'Product by name founded',
        data: product
      }
    }else{
      return {message: 'Producto no encontrado... productName: ' + productName};
    }
  }

  getProductById(productId){
    const product = this.products.find(product => product.refId === productId);
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
      refId: faker.datatype.uuid(),
      ref: body.ref,
      name: body.name,
      cost: body.cost,
      price: body.price,
      image: body.image
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
    let index = this.products.findIndex(product => product.refId === productId);
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
  }

  deleteProduct(productId){
    let product = this.products.find(product => product.refId === productId);
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
