import {useFormState} from "react-dom";
import {useForm} from "react-hook-form"

export default function SigninForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({

    });

    const onSubmit = async (e) => {

    }

    return (
        <form className="signin-form" >
            <label htmlFor="email">
                Email
                <input type="email" name="email" id="email" placeholder="example@gmail.com" {...register('email')} />
            </label>

            <label htmlFor="password">
                Password
                <input type="password" name="password" id="password" {...register('password')} />
                    <button className="show-password-btn"></button>
            </label>

            <button type="submit">Sign in</button>
        </form>
    );
}