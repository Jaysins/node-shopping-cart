import { Request, Response } from 'express';
import { BaseController } from '../../core/base/controller';
import { CreateProductDTO, IProductDocument, UpdateProductDTO } from './interfaces';
import { ProductService } from './services';


export class ProductController extends BaseController<IProductDocument, ProductService> {
  constructor(service: ProductService) {
    super(service);
  }

  createProduct = this.asyncHandler(async (req: Request, res: Response) => {
    const productData: CreateProductDTO = req.body;
    const product = await this.service.createProduct(productData);
    this.sendSuccess(res, product, 'Product created successfully', 201);
  });

  updateProduct = this.asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const updateData: UpdateProductDTO = req.body;
    const product = await this.service.updateProduct(productId, updateData);
    this.sendSuccess(res, product, 'Product updated successfully');
  });

  getProduct = this.asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await this.service.getById(productId);
    this.sendSuccess(res, product, 'Product retrieved successfully');
  });

  listProducts = this.asyncHandler(async (req: Request, res: Response) => {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};
  
    const result = await this.service.getPaginated(
      filter,
      Number(page),
      Number(limit)
    );

    this.sendSuccess(res, result.data, 'Products retrieved successfully', 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    },
    );
  });
  
}