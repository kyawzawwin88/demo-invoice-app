import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

/**
 * Address domain entity interface.
 */
export interface IAddress {
  id?: number;
  street: string;
  city: string;
  postCode: string;
  country: string;
}

/**
 * Address domain plain object class.
 */
export class Address implements IAddress {
  @Exclude()
  id: number;
  @ApiProperty({ type: String })
  street: string;
  @ApiProperty({ type: String })
  city: string;
  @ApiProperty({ type: String })
  postCode: string;
  @ApiProperty({ type: String })
  country: string;

  toEntityInput(): IAddress {
    return {
      id: this.id,
      street: this.street,
      city: this.city,
      postCode: this.postCode,
      country: this.country
    };
  }
}
