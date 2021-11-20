<!--http://localhost:8090/#/oms/orderSetting-->
<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="orderSetting"
             ref="orderSettingForm"
             :rules="rules"
             label-width="230px">
      <el-form-item label="Spike orders exceed：" prop="flashOrderOvertime">
        <el-input v-model="orderSetting.flashOrderOvertime" class="input-width">
          <template slot="append">Minute</template>
        </el-input>
        <span class="note-margin">Unpaid, the order is automatically closed</span>
      </el-form-item>
      <el-form-item label="Normal order exceeds：" prop="normalOrderOvertime">
        <el-input v-model="orderSetting.normalOrderOvertime" class="input-width">
          <template slot="append">Minute</template>
        </el-input>
        <span class="note-margin">Unpaid, the order is automatically closed</span>
      </el-form-item>
      <el-form-item label="Shipment exceeds：" prop="confirmOvertime">
        <el-input v-model="orderSetting.confirmOvertime" class="input-width">
          <template slot="append">sky</template>
        </el-input>
        <span class="note-margin">Not received, the order is automatically completed</span>
      </el-form-item>
      <el-form-item label="Order completed more than：" prop="finishOvertime">
        <el-input v-model="orderSetting.finishOvertime" class="input-width">
          <template slot="append">sky</template>
        </el-input>
        <span class="note-margin">Automatically end the transaction, cannot apply for after-sales</span>
      </el-form-item>
      <el-form-item label="Order completed more than：" prop="commentOvertime">
        <el-input v-model="orderSetting.commentOvertime" class="input-width">
          <template slot="append">sky</template>
        </el-input>
        <span class="note-margin">Automatic five-star praise</span>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="confirm('orderSettingForm')"
          type="primary">submit</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {getOrderSetting,updateOrderSetting} from '@/api/orderSetting';
  const defaultOrderSetting = {
    id: null,
    flashOrderOvertime: 0,
    normalOrderOvertime: 0,
    confirmOvertime: 0,
    finishOvertime: 0,
    commentOvertime: 0
  };
  const checkTime = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('Time cannot be empty'));
    }
    console.log("checkTime",value);
    let intValue = parseInt(value);
    if (!Number.isInteger(intValue)) {
      return callback(new Error('Please enter a numeric value'));
    }
    callback();
  };
  export default {
    name: 'orderSetting',
    data() {
      return {
        orderSetting: Object.assign({}, defaultOrderSetting),
        rules: {
          flashOrderOvertime:{validator: checkTime, trigger: 'blur' },
          normalOrderOvertime:{validator: checkTime, trigger: 'blur' },
          confirmOvertime: {validator: checkTime, trigger: 'blur' },
          finishOvertime: {validator: checkTime, trigger: 'blur' },
          commentOvertime:{validator: checkTime, trigger: 'blur' }
        }
      }
    },
    created(){
      this.getDetail();
    },
    methods:{
      confirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('Do you want to submit changes?', 'Hint', {
              confirmButtonText: 'Sure',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              updateOrderSetting(1,this.orderSetting).then(response=>{
                this.$message({
                  type: 'success',
                  message: 'Submitted successfully!',
                  duration:1000
                });
              })
            });
          } else {
            this.$message({
              message: 'Invalid submission parameters',
              type: 'warning'
            });
            return false;
          }
        });
      },
      getDetail(){
        getOrderSetting(1).then(response=>{
          this.orderSetting=response.data;
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 50%;
  }

  .note-margin {
    margin-left: 15px;
  }
</style>


