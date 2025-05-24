import { Entity, Column, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { Address, IAddress } from '../domains/address';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Database specific address entity class.
 * This layer should be changed if the database infrastructure changes.
 */
@Entity('addresses')
export class AddressEntity extends Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column({ name: 'post_code' })
  postCode: string;

  @Column()
  country: string;
}

export interface IAddressDAO {
  findOrCreate(data: Partial<Address>): Promise<Address>;
}

export const IAddressDAO = Symbol('IAddressDAO');

@Injectable()
export class AddressDAO implements IAddressDAO {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async findOrCreate(data: Partial<IAddress>): Promise<Address> {
    const existingAddress = await this.addressRepository.findOne({
      where: {
        street: data.street,
        city: data.city,
        postCode: data.postCode,
        country: data.country
      }
    });

    if (existingAddress) {
      return existingAddress;
    }

    const newAddress = this.addressRepository.create(data);
    return this.addressRepository.save(newAddress);
  }  
}
