<script setup>
import { ref, onMounted } from "vue";
import { userLogin } from '../services/authService';
import { GetSdkInfo, AuthSdk, CreateNewTicket } from '../services/chatSdkService';


import { MessageCircleMore } from 'lucide-vue-next'

const showChat = ref(false);
const formSubmitted = ref(false);
const customer = ref({
    name: "",
    email: "",
    phone: "",
});

const errors = ref({
    name: false,
    email: false,
    phone: false,
});

onMounted(async () => {
    try {
        const loginRes = await userLogin('omarsabra509@test.com', 'string');
        console.log('Login Response:', loginRes.data);

        const sdkRes = await GetSdkInfo();
        console.log('SDK Info:', sdkRes.data);

        const { private_key, public_key } = sdkRes.data[0];
        const AuthRes = await AuthSdk(private_key, public_key);
        console.log("Auth SDK Response:", AuthRes.data);
    } catch (err) {
        console.error('API Error:', err);
    }
});

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePhone = (phone) => {
    return phone.startsWith("+20") && phone.length > 3;
};

const validateForm = () => {
    errors.value.name = customer.value.name === "";
    errors.value.email = !validateEmail(customer.value.email);
    errors.value.phone = !validatePhone(customer.value.phone);
    return !(errors.value.name || errors.value.email || errors.value.phone);
};

const handleCreateTicket = async () => {
    if (!validateForm()) return;

    try {
        const token = localStorage.getItem("token");
        const NewTicketRes = await CreateNewTicket(customer.value, token);
        console.log("New Ticket Created:", NewTicketRes.data);


        customer.value = { name: "", email: "", phone: "" };
        formSubmitted.value = true;
    } catch (err) {
        console.error("Error:", err);
    }
};
</script>

<template>
    <div>
        <div class="chat-icon" @click="showChat = !showChat">
            <MessageCircleMore />
        </div>

        <div class="chat-box" v-if="showChat">
            <template v-if="!formSubmitted">
                <h2 class="text-xl text-center">Register your data</h2>
                <br />
                <input v-model="customer.name" placeholder="name" :class="{ error: errors.name }" />
                <input v-model="customer.email" placeholder="email" :class="{ error: errors.email }" />
                <input v-model="customer.phone" placeholder="phone number" :class="{ error: errors.phone }" />
                <button @click="handleCreateTicket">send</button>
            </template>
            <template v-else>
                <h3>You will be transferred to a customer service representative.</h3>
            </template>
        </div>
    </div>
</template>

<style scoped>
.chat-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    width: 55px;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-size: 32px;
    z-index: 1000;
}

.chat-box {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1000;
}

.chat-box input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.chat-box input.error {
    border-color: red;
}

.chat-box button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.chat-box button:hover {
    background: #0056b3;
}
</style>
