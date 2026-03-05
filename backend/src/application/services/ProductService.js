import ValidationError from '../../domain/errors/ValidationError.js';
import NotFoundError from '../../domain/errors/NotFoundError.js';

class ProductService {
  /**
   * @param {import('../../domain/repositories/IProductRepository.js').default} productRepository
   * @param {import('../../domain/repositories/IInventoryRepository.js').default} inventoryRepository
   */
  constructor(productRepository, inventoryRepository) {
    this.productRepository = productRepository;
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * Crea un nuevo producto con inventario inicial
   * @param {Object} productData
   * @returns {Promise<Object>}
   */
  async createProduct(productData) {
    if (!productData.name || !productData.sku) {
      throw new ValidationError('Nombre y SKU son requeridos');
    }

    if (productData.price === undefined || productData.price <= 0) {
      throw new ValidationError('El precio debe ser mayor a 0');
    }

    const existingProduct = await this.productRepository.findBySku(productData.sku);
    if (existingProduct) {
      throw new ValidationError('El SKU ya esta en uso');
    }

    const { initialStock, minStock, ...data } = productData;
    const product = await this.productRepository.create(data);

    await this.inventoryRepository.create({
      productId: product.id,
      quantity: initialStock || 0,
      minStock: minStock || null,
    });

    return product;
  }

  /**
   * Obtiene un producto por ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }
    return product;
  }

  /**
   * Obtiene todos los productos
   * @returns {Promise<Array>}
   */
  async getAllProducts(userId) {
    return await this.productRepository.findAll(userId);
  }

  /**
   * Obtiene productos por categoria
   * @param {string} category
   * @returns {Promise<Array>}
   */
  async getProductsByCategory(category, userId) {
    return await this.productRepository.findByCategory(category, userId);
  }

  /**
   * Actualiza un producto
   * @param {string} id
   * @param {Object} productData
   * @returns {Promise<Object>}
   */
  async updateProduct(id, productData) {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Producto no encontrado');
    }

    const { initialStock, minStock, ...data } = productData;
    const updatedProduct = await this.productRepository.update(id, data);

    if (initialStock !== undefined || minStock !== undefined) {
      const inventory = await this.inventoryRepository.findByProductId(id);
      if (inventory) {
        await this.inventoryRepository.update({
          id: inventory.id,
          quantity: initialStock !== undefined ? initialStock : inventory.quantity,
          minStock: minStock !== undefined ? minStock : inventory.minStock,
        });
      }
    }

    return updatedProduct;
  }

  /**
   * Elimina un producto
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteProduct(id) {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Producto no encontrado');
    }

    // Inventory deletion is handled by PrismaProductRepository manually to bypass SQLite constraint issues.

    return await this.productRepository.delete(id);
  }
}

export default ProductService;
