<template>
    <div>
        <v-container>
            <v-card-title class="w-auto gradient-text text-h4 pl-0">
                Power BI Dashboards
            </v-card-title>
            <v-row>
                <v-col class="text-center" cols="auto">
                    <v-btn color="primary" @click="generateUrl('detCaseLoadRpt')">
                        <img class="h-20" :src="PowerBiIcon" />
                    </v-btn><br />
                    detCaseLoadRpt
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card class="iframe-container" height="600">
                        <iframe :src="iframeUrl" width="100%" height="100%"></iframe>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import PowerBiIcon from '../assets/powerBi-Icon.png';
export default {
    data() {
        return {
            iframeUrl: '',
            PowerBiIcon: PowerBiIcon
        }
    },
    methods: {
        generateUrl(value) {
            let detCaseLoadRpt = 'https://app.powerbigov.us/reportEmbed?reportId=9a624a9f-509e-4ef6-9ed4-c29c88878905&autoAuth=true&ctid=642fd61c-34dd-4fd0-af8d-443576485883'
            switch (value) {
                case 'detCaseLoadRpt': this.iframeUrl = detCaseLoadRpt;
            }

        }
    }
}
</script>

<style scoped>
.iframe-container {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

iframe {
    border: none;
}

.h-20 {
    height: 20px;
}
</style>