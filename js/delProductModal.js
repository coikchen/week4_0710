Vue.component('delProductModal',{
  // 樣式html
  template:`
  <div class="modal fade" id="delProductModal" data-backdrop="static" tabindex="-1" role="dialog"
  aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">刪除產品</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        真的要刪除嗎？
        <strong class="text-danger">{{tempProduct.title}}</strong>這是回不去的啊！
      </div>
      <div class="modal-footer">
        
        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
        <button type="button" v-on:click='delProduct' class="btn btn-primary">就是要刪</button>
      </div>
    </div>
  </div>
</div> 
  `,
  // 一定要使用return .....
  data(){
    return{
    };
  },
  props:['tempProduct','user'],
  methods:{
    delProduct() {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
      // axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios.delete(api)
        .then(() => {
          $('#delProductModal').modal('hide');
          // this.getProducts();
          // 只要寫update就好,沒有東西要上傳
          this.$emit("update")
        })
        .catch((error)=>{
          console.log('錯了！錯了!'+ error)
        })
    },
  }





})