
// import Vuex from 'vuex'
import { defineStore } from 'pinia'

interface IMenuInfo {
  index: string
  name: string
}
interface IActivedMenu {
  index: string
  name: string
  menuPath: Array<IMenuInfo>,
}

export interface IMenu {
  index: string
  name: string
  children: Array<IMenu>
}

export const useMenu = defineStore('menu', {
  state: () => {
    return {
      activedMenu: {
        index: '',
        name: '',
        menuPath: [] as Array<IMenuInfo>,
      }
    }
  },
  getters: {
    currentMenu: (state) => {
      return state.activedMenu
    },
    menuPath() {
      const cm = this.currentMenu as IActivedMenu
      return cm.menuPath
    },
  },
  actions: {
    setCurrentMenu(menuInfo: IActivedMenu) {
      this.activedMenu = menuInfo
    }
  },
})