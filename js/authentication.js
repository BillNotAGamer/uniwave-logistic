import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

	const Login = () => {
    		return (
        		<GoogleOAuthProvider clientId="914225695260-55e0tgrlg8ptp7kjml6f95fbumaqctak.apps.googleusercontent.com">
            			<GoogleLogin
                			onSuccess={(response) => {
                    				console.log("Google Response:", response);
                    				fetch("https://your-api.com/api/auth/google", {
                        				method: "POST",
                        				headers: { "Content-Type": "application/json" },
                        				body: JSON.stringify({ token: response.credential }),
                    				})
                    				.then(res => res.json())
                    				.then(data => {
                        				localStorage.setItem("token", data.token);
                        				alert("Đăng nhập thành công!");
                    				})
                    				.catch(err => console.error("Lỗi:", err));
                			}}
                			onError={() => console.log("Đăng nhập thất bại")}
            			/>
        		</GoogleOAuthProvider>
    		);
	};

	export default Login;
