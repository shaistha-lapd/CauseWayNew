<template>
    <v-container fluid class="generator-background">
        <div class="text-center d-flex justify-center">
            <v-card-title class="w-auto gradient-text text-h4 py-6 text-center">
                QR Code Generator
            </v-card-title>
        </div>
        <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" sm="8" md="6" lg="6">
                <v-card class="elevation-20" dark>
                    <v-card-text>
                        <v-text-field label="Enter text or URL" v-model="inputText" outlined denseQRCodeGenerator
                            class="mb-5" append-icon="mdi-qrcode-scan" single-line></v-text-field>
                        <div class="text-center">
                            <vue-qrcode :value="inputText" class="qr-code mx-auto" v-if="inputText"></vue-qrcode>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";

export default {
    components: {
        VueQrcode,
    },
    data() {
        return {
            inputText: "",
        };
    },
};
</script>
  
<style scoped>
.generator-background {
    background: linear-gradient(135deg, #06202a, #2c5364);
    min-height: 100vh;
    justify-content: center;
}

.v-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.v-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.gradient-text {
    background: linear-gradient(to right, #8e9eab, #eef2f3, #8e9eab);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 3em;
    font-weight: bold;
    text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    animation: shine 8s linear infinite;
    background-size: 200% auto;
}

@keyframes shine {
    0% {
        background-position: right;
    }

    100% {
        background-position: left;
    }
}

.qr-code {
    max-width: 250px;
    margin-top: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.qr-code:hover {
    transform: rotate(-5deg) scale(1.1);
}

.v-text-field .v-label,
.v-text-field .v-input__control {
    transition: all 0.3s ease;
}

.v-text-field:hover .v-label {
    color: #23445d;
}

.v-text-field:focus-within .v-label {
    font-size: 1.25rem;
    color: #0a0f0d;
}

html {
    scrollbar-width: thin;
    scrollbar-color: #23445d #0a0f0d;
}

html::-webkit-scrollbar {
    width: 12px;
}

html::-webkit-scrollbar-track {
    background: #0a0f0d;
}

html::-webkit-scrollbar-thumb {
    background-color: #23445d;
    border-radius: 20px;
    border: 3px solid #0a0f0d;
}
</style>