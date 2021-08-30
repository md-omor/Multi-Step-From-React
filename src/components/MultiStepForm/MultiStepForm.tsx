import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import { Field, Form, Formik, FormikConfig, FormikValues } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { useState } from "react";
import { mixed, number, object } from "yup";
import "./MultiStepForm.css";

const sleep = (time) => new Promise((acc) => setTimeout(acc, time));

const MultiStepForm = () => {
  return (
    <div className="multiStep_Form">
      <Card>
        <div className="multiStep_Form_container">
          <h5 className="multiStep_form_h5">Multi-Step Form</h5>
          <CardContent>
            <FormikStepper
              initialValues={{
                firstName: "",
                lastName: "",
                millioniar: false,
                money: 0,
                description: "",
              }}
              onSubmit={async (values) => {
                await sleep(2000);
                console.log("values", values);
              }}
            >
              <FormikStep label="Personal Data">
                <Box paddingBottom={2}>
                  <Field
                    fullWidth
                    name="firstName"
                    component={TextField}
                    label="First Name"
                  />
                </Box>
                <Box paddingBottom={2}>
                  <Field
                    fullWidth
                    name="lastName"
                    component={TextField}
                    label="Last Name"
                  />
                </Box>
                <Box paddingBottom={2}>
                  <Field
                    name="millioniare"
                    component={CheckboxWithLabel}
                    Label={{ label: "I'm a millionaire" }}
                    type="checkbox"
                  />
                </Box>
              </FormikStep>
              <FormikStep
                label="Bank Accounts"
                validationSchema={object({
                  money: mixed().when("millioniare", {
                    is: true,
                    then: number()
                      .required()
                      .min(
                        1_000_000,
                        "Because you said you are a millioniare you need to have 1 Million USD"
                      ),
                    otherwise: number().required(),
                  }),
                })}
              >
                <Box paddingBottom={2}>
                  <Field
                    fullWidth
                    name="money"
                    component={TextField}
                    label="All the money I have"
                    type="number"
                  />
                </Box>
              </FormikStep>

              <FormikStep label="More Info">
                <Box paddingBottom={2}>
                  <Field
                    fullWidth
                    name="description"
                    component={TextField}
                    label="Description"
                  />
                </Box>
              </FormikStep>
            </FormikStepper>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default MultiStepForm;

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement<FormikStepProps>[];

  const [step, setstep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setcompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }
  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setcompleted(true);
          helpers.resetForm();
          setstep(0);
        } else {
          setstep((s) => s + 1);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper
            alternativeLabel
            activeStep={step}
            className="multiStep_Form_container_main"
          >
            {/* <div className="multiStep_Form_container_main"> */}
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index && completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
            {/* </div> */}
          </Stepper>

          {currentChild}

          <Grid container spacing={2}>
            {step > 0 ? (
              <Grid item>
                <Button
                  onClick={() => setstep((s) => s - 1)}
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                type="submit"
                color="primary"
                variant="contained"
              >
                {isSubmitting ? "Submittt" : isLastStep() ? "Submit" : "Next"}
              </Button>
            </Grid>
          </Grid>
          <div className="made_by">
            <h5>Made by 🚀</h5>{" "}
            <a href="https://mdomor.netlify.app/" target="_">
              Md Omor
            </a>
          </div>
        </Form>
      )}
    </Formik>
  );
}
