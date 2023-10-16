import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

let renderCount = 0;

const YoutubeForm = () => {
  const form = useForm({
    defaultValues: {
      username: "batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phone: ["98", "2"],
      phNumbers: [{ no: "" }],
      age: 0,
      dob: new Date(),
    },
    mode: "all",
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form;
  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
  } = formState;

  console.log({ touchedFields, dirtyFields });
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data) => {
    console.log("form submitted", data);
  };

  const onError = (errors) => {
    console.log("form error", errors);
  };

  useEffect(() => {
    const subs = watch((value) => {
      console.log(value);
    });
    return () => subs.unsubscribe();
  }, [watch]);

  const handleGetValues = () => {
    console.log("get values", getValues("social"));
  };
  const handleSetValues = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const watchUsername = watch(["username", "email"]);

  renderCount++;

  return (
    <>
      <div className="flex justify-center items-center p-4">
        <h1 className="">{renderCount / 2}</h1>
        {/* <h1 className="">watched: {watchUsername}</h1> */}

        <form
          className=""
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
        >
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="block"
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />
          <p>{errors.username?.message}</p>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid email format",
              },
              validate: {
                notAdmin: (v) => {
                  return v !== "admin@example.com" || "enter different email";
                },
                notBlackListed: (v) => {
                  return (
                    !v.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  return data.length == 0 || "email already exists";
                },
              },
            })}
            id="email"
            className="block"
          />
          <p>{errors.email?.message}</p>

          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            {...register("channel", { required: "Chnnnel requirerd" })}
            id="channel"
            className="block"
          />
          <p>{errors.channel?.message}</p>

          <label htmlFor="twitter">twitter</label>
          <input
            type="text"
            {...register("social.twitter", { required: "tiwwerter requirerd" })}
            id="twitter"
            className="block"
          />
          <label htmlFor="phone">phone</label>
          <input
            type="text"
            {...register("phone.1", { required: "phone requirerd" })}
            id="phone"
            className="block"
          />

          <div>
            <label> Phones list</label>
            <div>
              {fields.map((field, index) => {
                console.log(field, index);
                return (
                  <div key={field.id}>
                    <input
                      type="text"
                      {...register(`phNumbers.${index}.no`)}
                      className="block bg-slate-500 text-white border p-2 border-blue-500"
                    />
                    {index > 0 && (
                      <button type="button" onClick={() => remove(index)}>
                        remove phone no
                      </button>
                    )}
                  </div>
                );
              })}
              <button type="button" onClick={() => append({ no: "" })}>
                add phone no
              </button>
            </div>
          </div>

          <label htmlFor="age">Age</label>
          <input
            type="number"
            {...register("age", {
              valueAsNumber: true,
              required: { value: true, message: "Chnnnel requirerd" },
            })}
            id="age"
            className="block"
          />
          <label htmlFor="date">Channel</label>
          <input
            type="date"
            {...register("date", {
              valueAsDate: true,
              required: { value: true, message: "date requirerd" },
            })}
            id="channel"
            className="block"
          />
          <button
            disabled={!isDirty || !isValid || isSubmitting}
            className="border bg-slate-500 text-white px-4 py-2 rounded-full "
          >
            Submit
          </button>
          <button type="button" onClick={handleGetValues}>
            Get values
          </button>
          <button type="button" onClick={handleSetValues}>
            Set values
          </button>
          <button type="button" onClick={handleSetValues}>
            Set values
          </button>
          <button type="button" onClick={() => trigger("channel")}>
            Trigger values
          </button>
        </form>
        <DevTool control={control} />
      </div>
    </>
  );
};

export default YoutubeForm;
