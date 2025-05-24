import React from 'react';
import Input from '../../../../shared/components/atoms/Input';
import { InvoiceFormAddressProps } from '../../types/InvoiceForm.type';

const InvoiceFormAddress: React.FC<InvoiceFormAddressProps> = ({
  streetAddress,
  city,
  postCode, 
  country,
  onStreetAddressChange,
  onCityChange,
  onPostCodeChange,
  onCountryChange
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Street Address
        </label>
        <Input
          aria-label='Street Address'
          type="text"
          value={streetAddress}
          fullWidth={true}
          onChange={(e) => onStreetAddressChange(e.target.value)}
        />
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted mb-2">
            City
          </label>
          <Input
            aria-label='City'
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-muted mb-2">
            Post Code
          </label>
          <Input
            aria-label='Post Code'
            type="text"
            value={postCode}
            onChange={(e) => onPostCodeChange(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-muted mb-2">
            Country
          </label>
          <Input
            aria-label='Country'
            type="text"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormAddress;
