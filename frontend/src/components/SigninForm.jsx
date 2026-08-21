export default function SigninForm() {
    return (
        <form className="signin-form">
            <label htmlFor="email">
                Email
                <input className="" type="email" name="email" id="email" placeholder="Email" />
            </label>

            <label htmlFor="username">
                Username
                <input className="" type="text" name="username" id="username" placeholder="Username" />
            </label>

            <label htmlFor="password">
                Password
                <input type="password" name="password" id="password" placeholder="Password"/>
                    <button className="show-password-btn"></button>
            </label>

            <button type="submit">Sign in</button>
        </form>
    );
}