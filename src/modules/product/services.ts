import { BaseService } from "../../core/base/service";
import { NotFoundError, ValidationError } from "../../core/errors";
import { CreateProductDTO, IProductDocument, UpdateProductDTO } from "./interfaces";
import ProductModel from "./models";
import { ClientSession } from 'mongoose';

import { ProductCache } from "./util";


export class ProductService extends BaseService<IProductDocument> {

  constructor(model: typeof ProductModel) {
    super(model);
  }
  

  async createProduct(data: CreateProductDTO): Promise<IProductDocument> {
    const product = await this.create(data);
    return product;
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<IProductDocument | null> {
    await ProductCache.invalidate(id);
    return this.model.findByIdAndUpdate(id, data, { 
      new: true,
      runValidators: true 
    }).exec();
    
  }

  async getById(id: string): Promise<IProductDocument> {
    const cachedProduct = await ProductCache.get(id);
    if (cachedProduct) return cachedProduct;

    const product = await super.getById(id);
    
    if (!product){
      throw new NotFoundError("product does not exist")
    }
    await ProductCache.set(product);
    return product;
  }

  async reserveStock(
    productId: string,
    quantity: number,
    expectedVersion: number
  ): Promise<void> {
    const result = await this.model.findOneAndUpdate(
      { 
        _id: productId,
        version: expectedVersion,
        stock: { $gte: quantity }
      },
      { $inc: { stock: -quantity, version: 1 } },
      { new: true }
    ).exec();
  
    if (!result) throw new ValidationError('Concurrent modification detected');
    await ProductCache.invalidate(productId);
  }

async releaseStock(
  productId: string,
  quantity: number,
  expectedVersion: number
): Promise<void> {
  const result = await this.model.findOneAndUpdate(
    { 
      _id: productId,
      version: expectedVersion
    },
    { $inc: { stock: quantity, version: -1 } },
    { new: true }
  ).exec();

  if (!result) throw new ValidationError('Concurrent modification during release');
  await ProductCache.invalidate(productId);
}

}

const productService = new ProductService(ProductModel)

export default productService