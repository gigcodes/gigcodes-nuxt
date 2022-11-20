<template>
  <div
    v-if="!loading"
    class="dossier bg-white shadow-lg rounded-sm border border-slate-200 relative"
  >
    <header class="px-5 py-4 border-b border-slate-100">
      <h2 class="font-semibold text-slate-800">
        {{ title }}
      </h2>
    </header>
    <div class="p-3 overflow-x-auto">
      <table
        :class="[{ 'has-checkboxes': hasCheckboxes }]"
        class="table-auto w-full"
      >
        <thead v-if="hasHeaders">
          <tr>
            <th v-if="hasCheckboxes" class="checkbox-col">
              <div class="flex items-center">
                <label class="inline-flex">
                  <span class="sr-only">Select all</span>
                  <input
                    class="form-checkbox"
                    type="checkbox"
                    :checked="allItemsChecked"
                    @click="checkAllItems"
                  >
                </label>
              </div>
            </th>

            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="[
                'column-' + column.value,
                {
                  active: isColumnActive(column),
                  'column-sortable': !isSearching,
                  'extra-col': column.extra,
                },
                'inline-flex',
              ]"
              :style="{ width: tableColWidth(column.width) }"
              @click="sortBy(column)"
            >
              {{ column.header }}
              <component :is="arrowIcons[tableOptions.sortOrder]" v-if="isColumnActive(column)" class="h-4 stroke-2" />
            </th>
            <th v-if="hasActions" class="column-actions" />
          </tr>
        </thead>
        <tbody ref="tbody">
          <tr v-for="(item, index) in items" :key="index">
            <td v-if="hasCheckboxes && !reordering" class="checkbox-col">
              <div class="flex items-center">
                <label class="inline-flex" :for="'checkbox-' + index">
                  <span class="sr-only">Select</span>
                  <input
                    :id="'checkbox-' + index"
                    class="form-checkbox"
                    type="checkbox"
                    :checked="item.checked"
                    @change="toggle(item)"
                  >
                </label>
              </div>
            </td>
            <td
              v-for="(column, i) in columns"
              :key="i"
              :class="[
                `cell-${column.value}`,
                {
                  'extra-col': column.extra,
                  'empty-col': !item[column.value],
                  'first-cell': i === 0,
                },
              ]"
            >
              <span class="sr-only">{{ column.header }}</span>
              <Cell
                :index="i"
                :item="item"
                :value="formatValue(item[column.value])"
                :column="column"
              />
            </td>

            <!-- actions -->
            <td v-if="hasActions" class="column-actions">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                    class="w-full justify-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronDownIcon
                      class="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="py-1">
                      <MenuItem
                        v-if="
                          tableOptions.partials.actions.includes('edit') &&
                            (item.can_edit === undefined || item.can_edit === true)
                        "
                        v-slot="{ active }"
                        :key="index"
                        as="div"
                      >
                        <a
                          href="javascript:void(0)"
                          :class="[
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm',
                          ]"
                          @click.prevent="goTo(item.edit_url)"
                        >
                          <PencilSquareIcon
                            class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Edit
                        </a>
                      </MenuItem>
                      <MenuItem
                        v-if="
                          tableOptions.partials?.actions?.includes('delete') &&
                            (item.can_delete === undefined ||
                              item.can_delete === true)
                        "
                        v-slot="{ active }"
                        :key="index"
                        as="div"
                      >
                        <a
                          href="javascript:void(0)"
                          :class="[
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm',
                          ]"
                          @click.prevent="showDeleteModal(item)"
                        >
                          <TrashIcon
                            class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Delete
                        </a>
                      </MenuItem>
                      <MenuItem
                        v-if="item.custom_action && item.custom_action_title"
                        v-slot="{ active }"
                        :key="index"
                        as="div"
                      >
                        <a
                          href="javascript:void(0)"
                          :class="[
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm',
                          ]"
                          @click.prevent="$emit(`action:${item.custom_action}`)"
                        >
                          {{ item.custom_action_title }}
                        </a>
                      </MenuItem>
                      <slot name="actions" :item="item" :index="index" />
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
          </tr>
        </tbody>
      </table>
      <modal
        :open="deleteModal"
        title="Delete item ?"
        body="On clicking confirm the selected item will be deleted. If you don't
                                  wish to do it then please press cancel."
        @cancel="deleteModal = false"
        @confirm="deleteItem"
      />

      <modal
        :open="deleteModalMulti"
        :title="`Delete ${ checkedItems.length} ${checkedItems.length === 1 ? 'item' : 'items' } ?`"
        body="On clicking confirm the selected item will be deleted. If you don't
                                        wish to do it then please press cancel."
        @cancel="deleteModalMulti = false"
        @confirm="deleteMultiple"
      />

      <div
        v-if="showBulkActions"
        :class="[
          'pl-1 my-2',
          { 'bulk-actions': true, 'no-checkboxes': !hasCheckboxes },
        ]"
      >
        <btn type="dangerFill" @click="uncheckAllItems">
          Uncheck All
        </btn>
        <btn
          type="danger"
          class="ml-2"
          @click="deleteModalMulti = true"
        >
          Delete {{ checkedItems.length }}
          {{ checkedItems.length === 1 ? 'item' : 'items' }}
        </btn>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between my-2">
        <Pagination
          :data="pagination"
          :limit="2"
          @pagination-change-page="paginationPageSelected"
        />
      </div>
    </div>
  </div>
</template>
<script>
</script>
<script setup lang="ts">
import { debounce, each, findWhere, indexOf } from 'underscore'
import Cookies from 'js-cookie'
import { computed, onMounted, PropType, ref, watch } from 'vue'
import {
  Menu, MenuButton, MenuItem, MenuItems
} from '@headlessui/vue'
import {
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/24/solid'

import type { Ref } from 'vue'
import { AxiosResponse } from 'axios'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'
import Pagination from '../pagination/Pagination.vue'
import Cell from '../support/Cell.vue'
import Btn from '../button/btn.vue'
import { RowResponse, columnType, rowType, AxiosItemsResponse } from '../../../types'
import { formatValue, tableColWidth } from '../../extensions/dossier'
import Modal from '../support/Modal.vue'

interface tableOptions {
  sort?: string
  sortOrder?: string
  checkboxes?: boolean
  headers?: boolean
  partials?: {
    actions: any
  }
}

const arrowIcons = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon
}

const props = defineProps({
  hasItems: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: null
  },
  tableOptions: {
    type: Object as PropType<tableOptions>,
    default: () => ({})
  },
  searchTerm: {
    type: String,
    default: null
  },
  collection: {
    type: String,
    required: true
  },
  getApi: {
    type: Function,
    required: true
  },
  deleteApi: {
    type: Function,
    required: true
  },
  deleteMultiApi: {
    type: Function,
    required: true
  }
})

const emit = defineEmits([
  'update:loading',
  'update:hasItems',
  'update:tableOptions',
  'update:columns',
  'update:searching',
  'update:selectedPage',
  'update:checked',
  'error',
  'redirect',
  '^action:'
])

const showActionsDropdown = ref(false)
const selectedPage = ref(
  Cookies.get(`gigcodes.table.${props.collection}.page`) ?? 1
)
const pagination: Ref<object | null> = ref({})
const columns: Ref<Array<columnType>> = ref([])
const items: Ref<Array<rowType>> = ref([])
const reordering: Ref<boolean> = ref(false)
const sortable: Ref<boolean> = ref(true)
const loading: Ref<boolean> = ref(true)
const isSearching: Ref<boolean> = ref(false)
const searchStarted: Ref<boolean> = ref(false)
const deleteModal: Ref<boolean> = ref(false)
const deleteModalMulti = ref(false)
const selectedItem: Ref<rowType | undefined> = ref()

/**
 * API calls definition for get,delete and delete
 * multiple items
 */
const deleteItem = async () => {
  if (props.deleteApi && selectedItem.value) {
    await props.deleteApi(selectedItem.value?.id)
      .then((response: AxiosResponse) => {
        removeItemFromList(selectedItem.value?.id)
        emit('error', response.data.message)
      })
      .catch((error: RowResponse) => {
        emit('error', error?.response?.data.message)
      })
    emit('error', 'Delete service is not setup')
  }
  deleteModal.value = false
}

const deleteMultiple = async () => {
  try {
    await props
      .deleteMultiApi({ items: checkedItems.value })
      .then((response: AxiosResponse) => {
        each(checkedItems.value, (id) => {
          removeItemFromList(id)
        })
        emit('error', response.data.message)
      })
      .catch((error: RowResponse) => {
        emit('error', error.response.data.message)
      })
  } catch (e) {
    emit('error', 'deleteMultiService is not setup')
  }
  deleteModalMulti.value = false
}

const getItems = () => {
  loading.value = true
  emit('update:loading', true)
  try {
    if (props.getApi) {
      props.getApi(getParameters.value)
        .then((response: AxiosItemsResponse) => {
          items.value = response.data?.data?.items
          columns.value = parseColumns(response.data.data.columns)
          loading.value = false
          emit('update:loading', false)
          pagination.value = response.data.pagination
        })
        .catch(() => {
          emit('update:loading', false)
          emit('error', 'Error fetching data')
        })
    }
  } catch (e) {
    emit('update:loading', false)
  }
  return true
}

const performSearch: any = () => {
  isSearching.value = true
  emit('update:searching', true)
  loading.value = true
  emit('update:loading', true)
  if (props.getApi && props.getApi({ q: props.searchTerm })) {
    props.getApi({ q: props.searchTerm })
      .then((response: AxiosResponse) => {
        items.value = response.data.data.items
        columns.value = parseColumns(response.data.data.columns)
        loading.value = false
        emit('update:loading', false)
        pagination.value = response.data.pagination
      })
      .catch(() => {
        loading.value = false
        emit('update:loading', false)
        emit('error', 'Error fetching data')
      })
  }
  isSearching.value = false
  emit('update:searching', false)
  deleteModal.value = false
}

const showDeleteModal = (item: rowType) => {
  deleteModal.value = true
  selectedItem.value = item
  showActionsDropdown.value = false
}

const allItemsChecked = computed(() => {
  return items.value.length === checkedItems.value.length
})

const checkedItems = computed<Array<any>>(() => {
  return items.value.filter(item => item.checked).map(item => item.id)
})

const checkedList = computed<Array<any>>(() => {
  return items.value.filter(item => item.checked)
})

const hasItems = computed(() => {
  return !loading.value && items.value && items.value.length
})

const hasCheckboxes = computed(() => {
  return props.tableOptions.checkboxes !== false
})

const showBulkActions = computed(() => {
  return (
    hasItems.value &&
    hasCheckboxes.value &&
    itemsAreChecked.value &&
    !reordering.value
  )
})

const itemsAreChecked = computed(() => {
  return checkedItems.value.length > 0
})

const hasHeaders = computed(() => {
  return props.tableOptions.headers !== false
})

const hasActions = computed(() => {
  return (
    props.tableOptions.partials?.actions !== undefined &&
    props.tableOptions.partials?.actions !== ''
  )
})

const getParameters = computed(() => {
  const sortOrder = Cookies.get(`gigcodes.table.${props.collection}.sortOrder`)
  const sort = Cookies.get(`gigcodes.table.${props.collection}.sort`)
  if (sortOrder && sort) {
    return {
      sort: sortOrder === 'asc' ? sort : `-${sort}`,
      page: selectedPage.value
    }
  } else {
    return {
      ...(props.tableOptions.sortOrder && {
        sort: props.tableOptions.sortOrder === 'asc'
          ? props.tableOptions.sort
          : `-${props.tableOptions.sort}`
      }),
      page: selectedPage.value
    }
  }
})

const isColumnActive = (col: columnType) => {
  if (isSearching.value) {
    return false
  }
  return col.value === props.tableOptions.sort
}

const removeItemFromList = (id: string | number | undefined) => {
  if (id) {
    const item = findWhere(items.value, { id })
    const index = item ? indexOf(items.value, item) : undefined
    index && items.value.splice(index, 1)
  }
}

const paginationPageSelected = (page: number) => {
  selectedPage.value = page
  Cookies.set(`gigcodes.table.${props.collection}.page`, page.toString())
  emit('update:selectedPage', page)
  getItems()
}

const toggle = (item: rowType): void => {
  item.checked = !item.checked
}

const uncheckAllItems = (): void => {
  each(items.value, function (item) {
    item.checked = false
  })
}

const checkAllItems = (): void => {
  const status = !allItemsChecked.value
  each(items.value, function (item) {
    item.checked = status
  })
}

const parseColumns = (columns: Array<any>): Array<columnType> => {
  // If a link column hasn't been explicitly defined, we'll make the first column the link.
  const linkColumnUndefined = findWhere(columns, { link: true }) === undefined

  return columns.map((column, i): columnType => {
    if (typeof column === 'string') {
      column = { value: column }
    }

    let sort, customLink
    // for sorting
    if (column.sort === undefined) {
      sort = true
    } else {
      sort = column.sort
    }
    // for custom link
    if (column.customLink === undefined) {
      customLink = false
    } else {
      customLink = column.customLink
    }
    return {
      checked: column.checked ?? false,
      value: column.value,
      header: column.header,
      extra: column.extra,
      width: column.width,
      sort,
      link: column.link || (linkColumnUndefined && i === 0),
      custom_link: customLink
    }
  })
}

const sortBy = (col: columnType) => {
  if (!sortable.value) {
    return
  }
  if (isSearching.value) {
    return
  }
  if (!col.sort) {
    return
  }
  const sort = col.value
  let sortOrder = 'desc'

  // If the current sort order was clicked again, change the direction.
  if (props.tableOptions.sort === sort) {
    sortOrder = props.tableOptions.sortOrder === 'asc' ? 'desc' : 'asc'
  }
  parentSortBy(sort, sortOrder)
}

const parentSortBy = (sort: string, sortOrder: string): void => {
  const options = props.tableOptions
  options.sort = sort
  options.sortOrder = sortOrder
  Cookies.set(`gigcodes.table.${props.collection}.sort`, sort)
  Cookies.set(`gigcodes.table.${props.collection}.sortOrder`, sortOrder)
  emit('update:tableOptions', options)
  getItems()
}

const goTo = (url: string): void => {
  emit('redirect', url)
  showActionsDropdown.value = false
}

watch(hasItems, (val) => {
  emit('update:hasItems', Boolean(val))
})

watch(columns, (val) => {
  emit('update:columns', val)
})

watch(itemsAreChecked, () => emit('update:checked', checkedList.value))

watch(
  () => props.searchTerm,
  (term) => {
    if (term && term.length > 3) {
      debounce(performSearch(), 3000)
      searchStarted.value = true
    } else if (searchStarted.value) {
      getItems()
      searchStarted.value = false
    }
  }
)

onMounted(() => [getItems()])
</script>
