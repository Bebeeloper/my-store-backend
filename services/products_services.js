const faker = require('faker');
const getConnection = require('../libs/postgres');

class ProductsServices {

  constructor(){

  }

  // Get all products from DB
  async getAllProducts(){
    const client = await getConnection();
    const responseDB = await client.query('SELECT * FROM products ORDER BY id ASC');
    return responseDB.rows;
  }

  // Make DB connection and prepare the response for router to get product by name or ref
  async getProductByName(productName){
    const client = await getConnection();
    const responseDB = await client.query("SELECT * FROM products WHERE LOWER(ref) LIKE $1 or LOWER(name) LIKE $1 ORDER BY id ASC", ['%' + productName + '%']);

    if (responseDB) {
      return {
        message: 'Product by name founded',
        data: responseDB.rows
      }
    }else{
      return {message: 'Producto no encontrado... productName: ' + productName};
    }
  }

  async getProductById(productId){
    const client = await getConnection();
    const responseDB = await this.getDBById(productId);

    if (responseDB.rows) {
      return {
        message: 'Product founded',
        data: responseDB.rows
      }
    }else{
      throw new Error('Producto no encontrado... productId: ' + productId);
    }
  }

  async postOneProduct(body){
    const client = await getConnection();
    const getDBProducts = await client.query("SELECT * FROM products WHERE ref = $1", [body.ref]);

    if (getDBProducts.rows.length > 0) {
      return {
        message: 'La referencia ya existe'
      }
    }else{
      if (Object.keys(body).length != 0) {

          const responseDB = await client.query(`INSERT INTO "products" ("ref", "name", "quantity", "cost", "price", "image")
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [body.ref, body.name, body.quantity, body.cost, body.price, body.image]);

          return {
            message: 'Product created successfully',
            data: responseDB.rows
          }
      }else{
        throw new Error('Debes poner un body en formato JSON');
      }
    }
  }

  async patchOneProduct(productId, body){
    const client = await getConnection();
    const getDBProduct = await this.getDBById(productId);
    let productArray = getDBProduct;
    let productFind = productArray.find(product => product.id === parseInt(productId));

    const fieldsToUpdate = {
      ...productFind,
      ...body
    };

    if (productFind) {
      const responseDB = await client.query('UPDATE products SET ref = $1, name = $2, quantity = $3, cost = $4, price = $5, image = $6 WHERE id = $7',
        [fieldsToUpdate.ref, fieldsToUpdate.name, fieldsToUpdate.quantity, fieldsToUpdate.cost, fieldsToUpdate.price, fieldsToUpdate.image, parseInt(productId)]);
      return {
        Message: 'Product updated successfully',
        data: fieldsToUpdate
      };
    }else{
      throw new Error('Product: ' + productId + ' not found');
    }
  }

  async deleteProduct(productId){
    const client = await getConnection();
    const responseDB = await this.getDBById(productId);

    if (responseDB) {
      const responseDeleteDB = await client.query('DELETE FROM products WHERE id = $1', [parseInt(productId)]);
      return {
        message: 'Product deleted successfully',
        data: responseDB
      }
    }else{
      return { ErrorMessage: 'Product: ' + productId + ' not found' };
    }
  }

  async getDBById(productId){
    const client = await getConnection();
    const responseDB = await client.query("SELECT * FROM products WHERE id = $1", [parseInt(productId)]);
    return responseDB.rows;
  }

}

module.exports = ProductsServices;
