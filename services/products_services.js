const faker = require('faker');

class ProductsServices {

  products = [{
    refId: faker.datatype.uuid(),
    ref: 'm-3547',
    name: 'Gorra',
    quantity: 1,
    cost: 25000,
    price: 35000,
    image: faker.image.imageUrl()
  },
  {
    refId: faker.datatype.uuid(),
    ref: 'p-6958',
    name: 'Camiseta',
    quantity: 1,
    cost: 35000,
    price: 50000,
    image: faker.image.imageUrl()
  },{
    refId: faker.datatype.uuid(),
    ref: 'p-1234',
    name: 'Pantalón',
    quantity: 1,
    cost: 25000,
    price: 35000,
    image: faker.image.imageUrl()
  },
  {
    refId: faker.datatype.uuid(),
    ref: 'k-1414',
    name: 'Zapatos',
    quantity: 1,
    cost: 35000,
    price: 50000,
    image: faker.image.imageUrl()
  }
];

  constructor(){

  }

  async getAllProducts(){
    return this.products;
  }

  getProductByName(productName){
    const product = this.products.filter(product => product.name.toLowerCase().includes(productName.toLowerCase()) || product.ref.toLowerCase().includes(productName.toLowerCase()));

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
      refId: faker.datatype.uuid(),
      ref: body.ref,
      name: body.name,
      quantity: body.quantity,
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
      throw new Error('Debes poner un body en formato JSON');
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
      throw new Error('Product: ' + productId + ' not found');
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
