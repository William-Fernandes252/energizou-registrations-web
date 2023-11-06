namespace EnergizouRegistrations {
  type LoggedUser = Models.User & import('jwt-decode').JwtPayload;

  namespace Models {
    interface PaginatedModel {}

    interface Company extends PaginatedModel {
      reason: string;
      cnpj: string;
      phone: string;
      representative: string;
      users: User[];
      adress: string;
      created: Date;
    }

    interface User {
      id: string;
      name: string;
      company?: Company;
      email: string;
    }

    interface Adress {
      street: string;
      number: string;
      cep: string;
    }

    type CompanyPreview = Omit<Company, 'users' | 'adress'>;
  }

  namespace RestAPI {
    type Resource = Models.Company | Models.User;

    type ResponsePaginatedData<T> = {
      items: T[];
      meta: {
        itemCount: number;
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
      };
      links: {
        first: string;
        previous: string;
        next: string;
        last: string;
      };
    };

    type ErrorResponseData = {
      detail: string;
    };

    type ValidationError<T extends Resource> = {
      [key: keyof Resource]: string[];
    };

    type ListResponseData<T extends Resource> = T extends Models.PaginatedModel
      ? ResponsePaginatedData[T]
      : T[];

    type ResponseData<T extends Resource> = T;

    type RegisterCompanyForm = Omit<Models.Company, 'users' | 'adress'> & {
      password: string;
    } & Omit<User, 'id'> &
      Adress;

    type UseModelOptions = {
      onError?: (error: unknown) => void;
      onSuccess?: (data: unknown) => void;
    };
  }
}
