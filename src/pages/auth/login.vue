<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

// Foydalanuvchi nomi uchun validator: faqat harflar va raqamlar bo'lishi kerak
const validateUsername = (
  rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!value) {
    callback(new Error("Iltimos, foydalanuvchi nomini kiriting"));
  } else if (!usernameRegex.test(value)) {
    callback(
      new Error(
        "Foydalanuvchi nomida faqat harflar va raqamlar bo'lishi mumkin"
      )
    );
  } else {
    callback();
  }
};

// Parol uchun validator: kuchli parol bo'lishi kerak
const validatePassword = (
  rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!value) {
    callback(new Error("Iltimos, parolni kiriting"));
  } else if (!passwordRegex.test(value)) {
    callback(
      new Error(
        "Parol kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi bo'lishi kerak"
      )
    );
  } else {
    callback();
  }
};

const loginFormRef = ref<InstanceType<typeof ElForm>>();
const loginForm = reactive({
  username: "",
  password: "",
});

const rules = reactive({
  username: [{ required: true, validator: validateUsername, trigger: "blur" }],
  password: [{ required: true, validator: validatePassword, trigger: "blur" }],
});

const onSubmit = () => {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success("Tizimga muvaffaqiyatli kirdingiz!");
      router.push("/admin");
    } else {
      ElMessage.error("Iltimos, formani to'g'ri to'ldiring.");
    }
  });
};
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-custom-background">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Tizimga Kirish
      </h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-position="top"
      >
        <el-form-item label="Foydalanuvchi nomi" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="Foydalanuvchi nomini kiriting"
            class="custom-input"
          />
        </el-form-item>
        <el-form-item label="Parol" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Parolni kiriting"
            show-password
            class="custom-input"
          />
        </el-form-item>
        <el-button
          type="primary"
          class="w-full custom-button mt-6"
          @click="onSubmit"
          >Kirish</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.bg-custom-background {
  background-color: #f3f4f6;
}

.custom-input .el-input__inner {
  border-color: #d1d5db;
  transition: border-color 0.3s ease;
}

.custom-input .el-input__inner:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.custom-button {
  background-color: #2563eb;
  border-color: #2563eb;
}

.custom-button:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.custom-button:focus {
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}
</style>
