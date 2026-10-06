import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "../../../validations/user.schema";
import UserHeader from "../../../components/common/UserHeader";
import Sidebar from "../../../components/layout/Sidebar";
import PasswordInput from "../../../components/common/PasswordInput";
import Button from "../../../components/common/Button";
import { useChangePasswordMutation } from "../../../services/api";
import ButtonLoader from "../../../components/common/ButtonLoader";
import { handleApiErrors } from "../../../utils/helper";
import FormErrorList from "../../../components/common/FormErrorList";

function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const [changePassword, { isSuccess, isLoading }] =
    useChangePasswordMutation();

  const isSubmittingForm = isSubmitting || isLoading;

  const onSubmit = async (data) => {
    try {
      await changePassword(data).unwrap();
      reset();
      console.log("Password Changed Successfully");
    } catch (apiError) {
      handleApiErrors(apiError, setError);
    }
  };
  return (
    <main className="customer-main">
      <div className="customer-wrap">
        <UserHeader
          kicker="SECURITY"
          title="Change password"
          description="Choose a strong password you do not use elsewhere."
        />
        <div className="customer-layout">
          <Sidebar />
          <section className="customer-content">
            <div className="customer-panel">
              {isSuccess && (
                <div className="auth-message success" role="alert">
                  Password Updated Successfully
                </div>
              )}

              {<FormErrorList error={errors.root?.server} />}

              <form id="password-form" onSubmit={handleSubmit(onSubmit)}>
                <PasswordInput
                  id="old-password"
                  label="Current Password"
                  labelClass="customer-label"
                  name="current_password"
                  placeholder="Enter a secure password"
                  {...register("current_password")}
                  error={errors.current_password}
                />

                <PasswordInput
                  id="new-password"
                  label="New Password"
                  labelClass="customer-label"
                  name="new_password"
                  placeholder="Enter a secure password"
                  {...register("new_password")}
                  error={errors.new_password}
                />

                <PasswordInput
                  id="confirm-password"
                  label="Confirm Password"
                  labelClass="customer-label"
                  name="confirm_password"
                  placeholder="Enter a secure password"
                  {...register("confirm_password")}
                  error={errors.confirm_password}
                />

                <Button
                  className="button customer-btn"
                  type="submit"
                  disabled={isSubmittingForm}
                >
                  {isSubmittingForm ? (
                    <>
                      <ButtonLoader />
                      Update password...
                    </>
                  ) : (
                    <>
                      Update password <i className="fa fa-lock"></i>
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

export default ChangePasswordForm;
