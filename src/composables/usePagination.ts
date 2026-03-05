import { ref, computed } from 'vue'

export function usePagination<T>(items: () => T[], perPage = 5) {
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(items().length / perPage))

  const paginated = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return items().slice(start, start + perPage)
  })

  const pages = computed(() =>
    Array.from({ length: totalPages.value }, (_, i) => i + 1)
  )

  function goTo(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  function reset() {
    currentPage.value = 1
  }

  return { currentPage, totalPages, paginated, pages, goTo, reset }
}