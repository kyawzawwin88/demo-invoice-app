// common fields in both api and ui
export interface CommonAddress {
  street?: string;
  city?: string;
  postCode?: string;
  country?: string;
}

// dto to be used in api, get
export interface AddressDto extends CommonAddress {
  
}

// type to be used in ui and getting data from api
export interface Address extends CommonAddress {
  id?: string;
}