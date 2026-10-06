import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../../../validations/user.schema";

import UserHeader from "../../../components/common/UserHeader";
import Sidebar from "../../../components/layout/Sidebar";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";
import ButtonLoader from "../../../components/common/ButtonLoader";
import {
  useEditProfileQuery,
  useUpdateProfileMutation,
} from "../../../services/api";
import { useEffect } from "react";
import { handleApiErrors } from "../../../utils/helper";
import FormErrorList from "../../../components/common/FormErrorList";

function ProfileSection() {
  const { data: user } = useEditProfileQuery();
  const [updateProfile, { isSuccess, isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const isSubmittingForm = isSubmitting || isLoading;

  const onSubmit = async (data) => {
    try {
      await updateProfile(data).unwrap();
    } catch (apiError) {
      handleApiErrors(apiError, setError);
    }
  };
  return (
    <main class="customer-main">
      <div class="customer-wrap">
        <UserHeader
          kicker="MY ACCOUNT"
          title="Edit Profile"
          description="Keep your contact details up to date."
        />
        <div class="customer-layout">
          <Sidebar />
          <section class="customer-content">
            <div class="customer-panel">
              {isSuccess && (
                <div className="auth-message success" role="alert">
                  Profile updated successfully
                </div>
              )}

              {<FormErrorList error={errors.root?.server} />}
              <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  label="First Name"
                  labelClass="customer-label"
                  id="profile-first-name"
                  name="first_name"
                  type="text"
                  placeholder="Enter First Name"
                  {...register("first_name")}
                  error={errors.first_name}
                />

                <FormInput
                  label="Last Name"
                  labelClass="customer-label"
                  id="profile-last-name"
                  name="last_name"
                  type="text"
                  placeholder="Enter Last Name"
                  {...register("last_name")}
                  error={errors.last_name}
                />

                <FormInput
                  label="Phone"
                  labelClass="customer-label"
                  id="profile-phone"
                  name="phone"
                  type="text"
                  placeholder="Enter Phone Number"
                  {...register("phone")}
                  error={errors.phone}
                />

                <FormInput
                  label="Email"
                  labelClass="customer-label"
                  id="profile-email"
                  name="email"
                  type="text"
                  placeholder="Enter Email Address"
                  {...register("email")}
                  error={errors.email}
                />

                <Button
                  type="submit"
                  className="button customer-btn"
                  disabled={isSubmittingForm}
                >
                  {isSubmittingForm ? (
                    <>
                      <ButtonLoader />
                      Save changes...
                    </>
                  ) : (
                    <>
                      Save changes
                      <i class="fa fa-check"></i>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProfileSection;
