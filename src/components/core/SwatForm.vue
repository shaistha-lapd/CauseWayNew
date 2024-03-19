<template>
  <v-app>
    <h1 class="main-title text-center mt-4">
      Special Weapons and Tactics (SWAT) <br />
      Warrant Analysis
    </h1>
    <v-stepper v-model="step" class="custom-stepper">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1"> </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 2" step="2"> </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 3" step="3"> </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 4" step="4"> </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="5"> </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content class="custom-stepper-content" step="1">
          <v-card class="mb-12" color="lighten-1" elevation="0">
            <h1>Basic Information</h1>
            <v-text-field
              v-model="DateTimeofNotification"
              class="mt-5"
              type="date"
              label="Date / Time of Notification"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="location"
              class="mt-3"
              onchange="handlechange()"
              label="Location"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="Area"
              class="mt-3"
              label="Area"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="DevisionRequesting"
              class="mt-3"
              label="Devision Requesting"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="Affiant"
              class="mt-3"
              label="Affiant"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="Telephone"
              class="mt-3"
              label="Telephone"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="DevisionSupervisorRequesting"
              class="mt-3"
              label="Devision Supervisor Requesting"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="Telephone"
              class="mt-3"
              label="Telephone"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="ServiceDateandTime"
              class="mt-3"
              label="Service Date and Time"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-autocomplete
              v-model="service"
              class="mt-3"
              :items="service"
              label="Type of Warrant/Service"
            ></v-autocomplete>
            <v-text-field
              v-model="CrimeInvestType"
              label="Crime/Invest Type"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="DRorInc"
              class="mt-3"
              label="DR # or Inc #"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
          </v-card>

          <v-btn color="primary" @click="step = 2"> Continue </v-btn>
        </v-stepper-content>

        <v-stepper-content class="custom-stepper-content" step="2">
          <v-card class="mb-12" color="lighten-1" elevation="0">
            <h1>SWAT WARRANT CRITERIA (FACTORS CONSIDERED)</h1>
            <v-checkbox
              v-model="Locationisheavilyfortified"
              label="Location is heavily fortified."
              color="red"
              value="Location is heavily fortified."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="ShootersPresent"
              color="red"
              label="Shooter(s) are known to be present (i.e, prior threat to engage police or prior shot fired)."
              value="Shooter(s) are known to be present (i.e, prior threat to engage police or prior shot fired)."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="WeaponPresent"
              label="Weapons are present and being used (high power/volume, automatic, etc)"
              color="red"
              value="Weapons are present and being used (high power/volume, automatic, etc)"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="GangMemberPresent"
              label="Gang Members are known to be present."
              color="red"
              value="Gang Members are known to be present."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="propensityViolence"
              label="The propensity for violence exists (shots fired at police / Community)."
              color="red"
              value="The propensity for violence exists (shots fired at police / Community)."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="DynamicOfficerSafety"
              label="The entry needs to be 'DYNAMIC' for officer safety concerns and or loss of evidence."
              color="red"
              value="The entry needs to be 'DYNAMIC' for officer safety concerns and or loss of evidence."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="diversionaryTactics"
              label="The use of diversionary tactics is anticipated."
              color="red"
              value="The use of diversionary tactics is anticipated."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="TraditionalWarrentServices"
              label="The circumstances are unusual and beyond the capabilities of traditional warrant service criteria."
              color="red"
              value="The circumstances are unusual and beyond the capabilities of traditional warrant service criteria."
              hide-details
            ></v-checkbox>
          </v-card>

          <v-btn color="primary" @click="step = 3"> Continue </v-btn>

          <v-btn text @click="step = 1"> Back </v-btn>
        </v-stepper-content>

        <v-stepper-content class="custom-stepper-content" step="3">
          <v-card class="mb-12" color="lighten-1" elevation="0">
            <h1>ADDITIONAL INFORMATION</h1>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="SuspectsNameandDOB"
                  label="Suspect(s) Name & DOB"
                  color="red"
                  value="Suspect(s) Name & DOB"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="SuspectsNameandDOB"
                  label="Suspect(s) Name & DOB"
                  color="red"
                  value="Suspect(s) Name & DOB"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="Criminalhistoryofsuspects"
                  label="Criminal history of suspect(s)"
                  color="red"
                  value="Criminal history of suspect(s)"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="Mentalillnessorconcern"
                  label="Mental illness or concern"
                  color="red"
                  value="Mental illness or concern"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="SuspectResideattheTargetLocation"
                  label="Suspect(s) reside at the target location"
                  color="red"
                  value="Suspect(s) reside at the target location"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="HistoryOfLocation"
                  label="History of location"
                  color="red"
                  value="History of location"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-radio-group v-model="radioGroup" class="mt-6 ms-1">
              <v-row>
                <v-col>
                  <span class="default-text">LA CLEAR contacted</span>
                </v-col>
                <v-col>
                  <v-radio value="Yes" label="Yes"></v-radio>
                </v-col>
                <v-col>
                  <v-radio value="No" label="No"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="Personcontacted"
                  label="Person contacted"
                  color="red"
                  value="Person contacted"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="DateandTime"
                  label="Date and Time"
                  color="red"
                  value="Date and Time"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <v-btn color="primary" @click="step += 1"> Continue </v-btn>

          <v-btn text @click="step = 2"> Back </v-btn>
        </v-stepper-content>
        <v-stepper-content class="custom-stepper-content" step="4">
          <v-card class="mb-12" color="lighten-1" elevation="0">
            <h1>ADDITIONAL INFORMATION</h1>
            <v-checkbox
              v-model="Discussedtactics"
              label="Discussed tactics concerns with."
              color="red"
              value="Discussed tactics concerns with."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="EvidenceServiceOrSuspectfromTargetLocation"
              label="Evidence only/Service post take-down or suspect away from the target location."
              color="red"
              value="Evidence only/Service post take-down or suspect away from the target location."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="NotifyServeWarrant"
              label="Serve warrant (SURROUND AND CALL OUT). Notify SWAT if incident results in a barricade situation."
              color="red"
              value="Serve warrant (SURROUND AND CALL OUT). Notify SWAT if incident results in a barricade situation."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="ServeWarrant"
              label="Serve warrant (RAPID ENTRY)."
              color="red"
              value="Serve warrant (RAPID ENTRY)."
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="ReferredMetropolitianDivision"
              label="Referred to METROPOLITAN DIVISION (B,C, OR E PLTNS)."
              color="red"
              value="Referred to METROPOLITAN DIVISION (B,C, OR E PLTNS)."
              hide-details
            ></v-checkbox>
            <v-row class="mt-2">
              <v-col>
                <v-checkbox
                  v-model="NotSWATCriteria"
                  label="Did not meet SWAT criteria"
                  color="red"
                  value="Did not meet SWAT ciriteria"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <v-btn color="primary" @click="step += 1"> Continue </v-btn>

          <v-btn text @click="step = 3"> Back </v-btn>
        </v-stepper-content>
        <v-stepper-content class="custom-stepper-content" step="5">
          <v-card class="mb-12" color="lighten-1" elevation="0">
            <h1>ADDITIONAL Suspects</h1>
            <v-row class="mt-2">
              <v-col>
                <v-checkbox
                  v-model="PersonCompletingForm"
                  label="Person Completing Form"
                  color="red"
                  value="Person Completing Form"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col>
                <v-checkbox
                  v-model="SWATSupervisorcontacted"
                  label="SWAT Supervisor contacted"
                  color="red"
                  value="SWAT Supervisor contacted"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-text-field class="mt-3" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
            <div v-for="item in dropdown" :key="item">
              <v-card class="mt-4">
                <span>Suspect-{{ item + 1 }} (or another known occupant)</span>
                <v-text-field
                  v-model="NameDOB"
                  class="mt-3"
                  label="Name/DOB"
                  hide-details="auto"
                ></v-text-field>
                <v-text-field
                  v-model="CriminalHistory"
                  class="mt-3"
                  label="Criminal History"
                  hide-details="auto"
                ></v-text-field>
                <v-text-field
                  v-model="MentalHealthHistory"
                  class="mt-3"
                  label="Mental Health History"
                  hide-details="auto"
                ></v-text-field>
                <v-text-field
                  v-model="GangAffilition"
                  class="mt-3"
                  label="Gang Affilition"
                  hide-details="auto"
                ></v-text-field>
              </v-card>
            </div>
            <v-btn color="primary" class="mt-2" @click="dropdown += 1"
              >Add Suspect +</v-btn
            >
            <v-btn
              text
              class="mt-2"
              @click="dropdown > 0 ? (dropdown -= 1) : dropdown"
              >Remove Suspect -</v-btn
            >
          </v-card>

          <v-btn color="primary" @click="snackbar = true"> Submit </v-btn>

          <v-btn text @click="step = 4"> Back </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "SwatForm",
  data() {
    return {
      step: 1,
      dropdown: 1,
      snackbar: false,
      DateTimeofNotification: "",
      Location: "",
      Area: "",
      DevisionRequesting: "",
      Affiant: "",
      Telephone: "",
      DevisionSupervisorRequesting: "",
      Telephone2: "",
      ServiceDateAndTime: "",
      CrimeInvestType: "",
      DRorInc: "",
      Locationisheavilyfortified: "",
      ShootersPresent: "",
      WeaponPresent: "",
      GangMemberPresent: "",
      propensityViolence: "",
      DynamicOfficerSafety: "",
      diversionaryTactics: "",
      TraditionalWarrentServices: "",
      SuspectsNameandDOB: "",
      Criminalhistoryofsuspects: "",
      Mentalillnessorconcern: "",
      SuspectResideattheTargetLocation: "",
      radioGroup: "",
      Personcontacted: "",
      DateandTime: "",
      Discussedtactics: "",
      EvidenceServiceOrSuspectfromTargetLocation: "",
      NotifyServeWarrant: "",
      ServeWarrant: "",
      ReferredMetropolitianDivision: "",
      NotSWATCriteria: "",
      PersonCompletingForm: "",
      SWATSupervisorcontacted: "",
      NameDOB: "",
      CriminalHistory: "",
      MentalHealthHistory: "",
      GangAffilition: "",

      TypeOfWarrant: "",
      SurroundCallout: "",
      CrimeType: "",
      DrOrInc: "",
      SuspactName: "",
      SuspactCriminalHistory: "",
      SuspactMentalIllness: "",
      SuspectTargetLocation: "",
      HistoryOfLocation: "",
      PersonContacted: "",
      PersonContactedDateTime: "",
      DiscussedTactics: "",
      SWATCiriteria: "",
      setSend: "",
      text: `Form Submitted`,
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
      service: ["Arrest", "Rapid", "Surround & Callout"],
    };
  },
  methods: {},
};
</script>

<style>
.v-parallax__image {
  transform: translate(-50%, 0) !important;
}

.col {
  padding: 0 0 0 10px !important;
}

.main-title {
  font-size: 2.5rem;
}

.custom-parallax {
  height: 100% !important;
}

.custom-stepper {
  margin: 40px auto;
  min-width: 900px;
  max-width: 900px;
  padding: 20px;
}

.default-text {
  color: rgba(0, 0, 0, 0.6);
}

.custom-stepper-content {
  margin-top: 20px;
  border: 1px solid rgba(0, 0, 0, 0.6) !important;
  border-radius: 10px;
}

.mt-4 {
  margin-top: 18px;
}

.mt-2 {
  margin-top: 9px;
}
</style>
