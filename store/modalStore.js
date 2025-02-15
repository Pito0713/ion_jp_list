export const modalStore = defineStore('modalStore', {
  state: () => ({
    isModal: false,
    modalText: null,
    modalLoading: false,
    modalStatus: 0,
  }),
  actions: {
    /*
      this 指向 當前  modalStore function
      需要訪問 state 需透過 this , 若不加 this
      javascript 會視為 在 ModalShow 內部的局部變數會找不值
    */
    ModalShow(_text, _status) {
      this.isModal = true
      this.modalText = _text
      this.modalStatus = _status
      if (!this.modalLoading) {
        this.modalLoading = true
        setTimeout(() => {
          this.isModal = false
          this.modalText = null
          this.modalLoading = false
          this.modalStatus = 0
        }, 2000)
      }
    }
  }
})