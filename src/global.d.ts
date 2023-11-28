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
      address: string;
      created: Date;
    }

    interface User {
      id: string;
      name: string;
      company?: Company;
      email: string;
    }

    interface Address {
      street: string;
      number: string;
      cep: string;
    }

    type CompanyPreview = Omit<Company, 'users' | 'address'>;
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

    type ListResponseData<T extends Resource> = T extends Models.PaginatedModel
      ? ResponsePaginatedData[T]
      : T[];

    type ResponseData<T extends Resource> = T;

    type PaginationParams = {
      page?: number;
      limit?: number;
    };

    type SortParams<K> = {
      sort?: K;
      order?: 'ASC' | 'DESC';
    };
  }

  namespace Errors {
    type ErrorOptions = {
      message: string;
      action: string;
      cause?: unknown;
      axiosError?: AxiosError;
    };
    interface Error {
      readonly message: string;
      readonly action: string;
      readonly cause: unknown;
    }
  }
}
