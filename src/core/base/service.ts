import { Model, Document } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { ValidationError } from '../errors';

export abstract class BaseService<T extends Document> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
  
  public async getPaginated(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    projection: Record<string, 0 | 1> = {}, 
    sort: Record<string, 1 | -1> = { _id: -1 } 
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    
    if (page < 1) throw new ValidationError('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
  
    const [data, total] = await Promise.all([
      this.model.find(filter)
        .select(projection)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean() 
        .exec(),
      this.model.countDocuments(filter) 
    ]);
  
    return {
      data: data as T[], 
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  public async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  public async getById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

}
