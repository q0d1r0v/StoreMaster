<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

// Full list of modules with paths and icons
const modules = ref([
  {
    name: "dashboardManagement",
    label: "Dashboard",
    icon: "ri-dashboard-fill",
    path: "/admin",
    subItems: [],
  },
  {
    name: "productManagement",
    label: "Mahsulot Boshqaruvi",
    icon: "ri-align-item-left-fill",
    path: "/",
    subItems: [
      {
        label: "Mahsulotlar",
        icon: "ri-file-list-line",
        path: "/admin/products",
      },
    ],
  },
  {
    name: "retailManagement",
    label: "Savdo",
    icon: "ri-store-fill",
    path: "/admin/sell",
    subItems: [],
  },
]);

const isOpen = ref({});
const isMini = ref(false);
const isModalOpen = ref(false);
const searchQuery = ref("");
const filteredModules = ref(modules.value);
const searchInputRef = ref(null); // Create a ref for the input field

const toggle = (item, action_name) => {
  if (isMini.value) {
    isMini.value = false;
  }
  isOpen.value[item] = !isOpen.value[item];

  if (action_name === "hide-search-modal") {
    isModalOpen.value = false;
    isOpen.value[item] = true;
  }
};

const router = useRouter();
const navigate = (path, action_name) => {
  router.push(path);
  if (isMini.value) {
    isMini.value = false;
  }
  if (action_name === "hide-search-modal") {
    isModalOpen.value = false;
  }
  isModalOpen.value = false;
};

const resizeSidebar = (e) => {
  const newWidth = startWidth + e.clientX - startX;
  if (newWidth > 200 && newWidth < 500) {
    document.querySelector(".sidebar").style.width = `${newWidth}px`;
  }
};

const initResize = (e) => {
  startX = e.clientX;
  startWidth = document.querySelector(".sidebar").offsetWidth;
  window.addEventListener("mousemove", resizeSidebar);
  window.addEventListener("mouseup", stopResize);
};

const stopResize = () => {
  window.removeEventListener("mousemove", resizeSidebar);
  window.removeEventListener("mouseup", stopResize);
};

onMounted(() => {
  const resizer = document.querySelector(".resizer");
  resizer.addEventListener("mousedown", initResize);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      isModalOpen.value = true;
    }
  });
});

const closeModal = () => {
  isModalOpen.value = false;
  searchQuery.value = "";
  filteredModules.value = modules.value;
};

const filterModules = () => {
  if (searchQuery.value) {
    filteredModules.value = modules.value.filter((module) => {
      // Check if the parent module matches
      const moduleMatches = module.label
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
      // Check if any child module matches
      const subItemMatches = module.subItems.some((subItem) =>
        subItem.label.toLowerCase().includes(searchQuery.value.toLowerCase())
      );

      return moduleMatches || subItemMatches;
    });
  } else {
    filteredModules.value = modules.value;
  }
};

watch(isModalOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      searchInputRef.value.focus(); // Focus the input when modal opens
    });
  }
});
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside
      class="sidebar bg-white p-6 flex flex-col resize-x overflow-hidden border"
      :class="{ mini: isMini }"
      :style="{ width: isMini ? '80px' : '300px' }"
    >
      <div
        class="mb-6 text-2xl flex items-center justify-center gap-2 cursor-pointer select-none"
        @click="$router.push('/admin')"
      >
        <div class="p-2 rounded-md bg-blue-600"></div>
        <div v-if="!isMini" class="whitespace-nowrap">Store Master</div>
      </div>
      <!-- Sidebar Content -->
      <nav>
        <ul class="space-y-4">
          <li
            v-for="module in modules"
            :key="module.name"
            class="flex flex-col select-none"
            :style="isMini ? 'margin-top: 12px' : ''"
          >
            <span
              class="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer"
              :style="
                !isMini && module.subItems.length > 0
                  ? 'justify-content: space-between;'
                  : ''
              "
              @click="toggle(module.name)"
              v-if="module.subItems.length > 0"
            >
              <div class="flex items-center justify-center gap-2">
                <Icon :icon="module.icon" class="text-2xl" />
                <span
                  class="text-lg font-normal whitespace-nowrap"
                  v-if="!isMini"
                >
                  {{ module.label }}
                </span>
              </div>
              <Icon
                v-if="!isMini && module.subItems.length > 0"
                @click.stop="toggle(module.name)"
                class="text-xl"
                :icon="
                  isOpen[module.name]
                    ? 'ri-arrow-up-s-line'
                    : 'ri-arrow-down-s-line'
                "
              ></Icon>
            </span>
            <span
              :class="
                $route.path === module.path
                  ? 'flex items-center gap-2 text-blue-600 hover:text-blue-600 transition duration-300 cursor-pointer'
                  : 'flex items-center gap-2 text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer'
              "
              :style="
                !isMini && module.subItems.length > 0
                  ? 'justify-content: space-between;'
                  : ''
              "
              @click="navigate(module.path)"
              v-else
            >
              <div class="flex items-center justify-center gap-2">
                <Icon :icon="module.icon" class="text-2xl" />
                <span
                  class="text-lg font-normal whitespace-nowrap"
                  v-if="!isMini"
                >
                  {{ module.label }}
                </span>
              </div>
              <Icon
                v-if="!isMini && module.subItems.length > 0"
                @click.stop="toggle(module.name)"
                class="text-xl"
                :icon="
                  isOpen[module.name]
                    ? 'ri-arrow-up-s-line'
                    : 'ri-arrow-down-s-line'
                "
              ></Icon>
            </span>
            <ul v-if="isOpen[module.name] && !isMini" class="ml-7 space-y-1">
              <li
                v-for="subItem in module.subItems"
                :key="subItem.label"
                :class="
                  $route.path === subItem.path
                    ? 'flex items-center gap-2 text-blue-600 hover:text-blue-600 transition duration-300 cursor-pointer'
                    : 'flex items-center gap-2 text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer'
                "
                @click="navigate(subItem.path)"
              >
                <Icon :icon="subItem.icon" class="mr-3 text-md" />
                <span class="text-base font-normal">{{ subItem.label }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <!-- Toggle Button -->
      <div class="flex justify-center items-center mt-auto">
        <button
          class="flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg gap-2"
          :class="{ 'w-full': !isMini }"
          @click="isMini = !isMini"
        >
          <Icon icon="ri-arrow-right-s-line" v-if="isMini" class="text-lg" />
          <Icon icon="ri-arrow-left-s-line" v-if="!isMini" class="text-lg" />
        </button>
      </div>
      <div
        class="resizer w-2 bg-gray-300"
        style="height: 100%; position: absolute; right: 0; top: 0"
      ></div>
    </aside>

    <main class="flex-1 flex flex-col">
      <header
        class="flex justify-between items-center mb-0 bg-white p-2 border-b"
      >
        <h1 class="text-xl text-gray-800">{{ $route.name }}</h1>
        <div class="flex items-center justify-center gap-4">
          <el-popover
            placement="top-start"
            title="Module qidiruv"
            :width="200"
            trigger="hover"
          >
            <template #reference>
              <el-button class="m-2" @click="isModalOpen = true"
                >CTRL + K <Icon icon="ri-search-line" class="ml-3"
              /></el-button>
            </template>
            <template #default>
              <div>
                Faqat modul nomini yoki submodul nomini yozing. (Masalan:
                "Mahsulot Boshqaruvi", "Qo'shish", va h.k.)
              </div>
            </template>
          </el-popover>
          <button
            class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full"
          >
            <Icon icon="ri-user-fill" />
          </button>
        </div>
      </header>

      <div class="flex-1 p-6">
        <router-view></router-view>
      </div>
    </main>

    <!-- Search Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      @keyup.esc="closeModal"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 class="text-lg font-semibold mb-4">Qidiruv</h2>
        <div class="mb-4">
          Faqat modul nomini yoki submodul nomini yozing. (Masalan: "Mahsulot
          Boshqaruvi", "Qo'shish", va h.k.)
        </div>
        <input
          ref="searchInputRef"
          type="text"
          v-model="searchQuery"
          @input="filterModules"
          placeholder="Modul nomi..."
          class="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <ul class="max-h-60 overflow-y-auto">
          <li v-for="module in filteredModules" :key="module.name" class="mb-2">
            <div
              @click="toggle(module.name, 'hide-search-modal')"
              class="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
              v-if="module.subItems.length > 0"
            >
              <span class="font-semibold">{{ module.label }}</span>
              <Icon :icon="module.icon" class="text-lg" />
            </div>
            <div
              @click="navigate(module.path, 'hide-search-modal')"
              class="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
              v-else
            >
              <span class="font-semibold">{{ module.label }}</span>
              <Icon :icon="module.icon" class="text-lg" />
            </div>
            <ul v-if="module.subItems.length > 0" class="ml-4">
              <li
                v-for="subItem in module.subItems"
                :key="subItem.label"
                @click.stop="navigate(subItem.path)"
                class="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <span>{{ subItem.label }}</span>
                <Icon :icon="subItem.icon" class="text-lg" />
              </li>
            </ul>
          </li>
        </ul>
        <button
          @click="closeModal"
          class="mt-4 w-full bg-red-500 text-white p-2 rounded"
        >
          Yopish
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  transition: width 0.3s;
}
.mini {
  width: 80px;
}
</style>
