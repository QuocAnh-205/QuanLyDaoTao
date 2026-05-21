package uni.it.stdmanager.modules.i_auth.service;

import uni.it.stdmanager.modules.i_auth.dto.request.IntrospectRequest;
import uni.it.stdmanager.modules.i_auth.dto.request.LoginRequest;
import uni.it.stdmanager.modules.i_auth.dto.response.AuthenticationResponse;
import uni.it.stdmanager.modules.i_auth.dto.response.IntrospectResponse;

public interface AuthService {
    AuthenticationResponse login(LoginRequest request);

    IntrospectResponse introspect(IntrospectRequest request);

    void register(uni.it.stdmanager.modules.i_auth.dto.request.RegisterRequest request);

    void processForgotPassword(uni.it.stdmanager.modules.i_auth.dto.request.ForgotPasswordRequest request);

    void resetPassword(uni.it.stdmanager.modules.i_auth.dto.request.ResetPasswordRequest request);
}