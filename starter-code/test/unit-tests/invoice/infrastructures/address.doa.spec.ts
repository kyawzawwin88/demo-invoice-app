import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDAO, AddressEntity } from '@app/api/invoice/infrastructures/address.dao';

describe('AddressDAO', () => {
  let addressDAO: AddressDAO;
  let addressRepository: Repository<AddressEntity>;

  const mockAddressRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressDAO,
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: mockAddressRepository
        }
      ]
    }).compile();

    addressDAO = module.get<AddressDAO>(AddressDAO);
    addressRepository = module.get<Repository<AddressEntity>>(getRepositoryToken(AddressEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreate', () => {
    const addressData = {
      street: '123 Test St',
      city: 'Test City', 
      postCode: '12345',
      country: 'Test Country'
    };

    it('should return existing address if found', async () => {
      const existingAddress = {
        id: 1,
        ...addressData
      };

      mockAddressRepository.findOne.mockResolvedValue(existingAddress);

      const result = await addressDAO.findOrCreate(addressData);

      expect(mockAddressRepository.findOne).toHaveBeenCalledWith({
        where: addressData
      });
      expect(mockAddressRepository.create).not.toHaveBeenCalled();
      expect(mockAddressRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(existingAddress);
    });

    it('should create and save new address if not found', async () => {
      const newAddress = {
        id: 1,
        ...addressData
      };

      mockAddressRepository.findOne.mockResolvedValue(null);
      mockAddressRepository.create.mockReturnValue(newAddress);
      mockAddressRepository.save.mockResolvedValue(newAddress);

      const result = await addressDAO.findOrCreate(addressData);

      expect(mockAddressRepository.findOne).toHaveBeenCalledWith({
        where: addressData
      });
      expect(mockAddressRepository.create).toHaveBeenCalledWith(addressData);
      expect(mockAddressRepository.save).toHaveBeenCalledWith(newAddress);
      expect(result).toEqual(newAddress);
    });
  });
});
