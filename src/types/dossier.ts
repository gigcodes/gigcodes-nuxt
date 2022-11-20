import { Pagination } from './common'

export type tableOptions = {
  sort?: string
  sortOrder?: string
  checkboxes?: boolean
  partials?: any
}

export interface DossierProps {
  hasItems: boolean,
  title: string,
  tableOptions: () => tableOptions,
  searchTerm: string,
  collection: string,
  getApi: any,
  deleteApi: any,
  deleteMultiApi: any,
}

export type RowResponse = {
  response: {
    data: { message: string; }
  }
}

export interface ModalEmits {
  (eventName: 'cancel'): void

  (eventName: 'confirm'): void
}

export interface ModalProps {
  open: boolean,
  loading: boolean
}

export type columnType = {
  checked: boolean
  value: string
  extra?: string
  header: string
  width: string
  sort?: string
  link: string | boolean
  custom_link?: string
}

export type rowType = {
  id?: string | number
  checked?: boolean
  custom_action: string
  custom_action_title: string
  can_edit?: boolean
  can_delete?: boolean
  edit_url?: string
  published?: boolean
}

export interface AxiosItemsResponse {
  data: {
    data: {
      items: Array<rowType>
      columns: any,
    },
    pagination: Pagination
  }
}
