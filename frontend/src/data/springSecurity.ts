import { springJava } from "./springAuthoring";

export function springSecurityFiles(publicCatalog: boolean) {
  return {
    [`${springJava}/SecurityConfig.java`]: `package devafrica.atelier;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
class SecurityConfig {
    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
        var roles = new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("roles");
        roles.setAuthorityPrefix("ROLE_");
        var jwtAuth = new JwtAuthenticationConverter();
        jwtAuth.setJwtGrantedAuthoritiesConverter(roles);

        // L’API accepte des jetons Bearer et ne crée pas de session navigateur.
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(routes -> routes
                        .requestMatchers("/", "/index.html", "/favicon.ico", "/error").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/token").permitAll()
${publicCatalog ? '                        .requestMatchers(HttpMethod.GET, "/api/products").permitAll()\n' : ""}                        .anyRequest().authenticated())
                .oauth2ResourceServer(server -> server.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuth)))
                .build();
    }
}
`,
    [`${springJava}/LocalTokens.java`]: `package devafrica.atelier;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.GeneralSecurityException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.List;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Configuration
@Profile("!prod")
class LocalTokens {
    static final String ISSUER = "https://atelier.devafrica.invalid";
    static final String AUDIENCE = "devafrica-atelier-api";

    @Bean
    KeyPair demoSigningKey() throws GeneralSecurityException {
        var generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        return generator.generateKeyPair();
    }

    @Bean
    JwtEncoder jwtEncoder(KeyPair key) {
        var jwk = new RSAKey.Builder((RSAPublicKey) key.getPublic())
                .privateKey((RSAPrivateKey) key.getPrivate()).build();
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(jwk)));
    }

    @Bean
    JwtDecoder jwtDecoder(KeyPair key) {
        var decoder = NimbusJwtDecoder.withPublicKey((RSAPublicKey) key.getPublic()).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(ISSUER),
                new JwtClaimValidator<List<String>>(JwtClaimNames.AUD,
                        aud -> aud != null && aud.contains(AUDIENCE))));
        return decoder;
    }

    @Bean
    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    InMemoryUserDetailsManager demoUsers(PasswordEncoder encoder,
            @Value("\${atelier.demo-password}") String password) {
        return new InMemoryUserDetailsManager(
                User.withUsername("alice").password(encoder.encode(password)).roles("USER").build(),
                User.withUsername("bob").password(encoder.encode(password)).roles("USER").build(),
                User.withUsername("admin").password(encoder.encode(password)).roles("ADMIN").build());
    }

    @Bean
    AuthenticationManager authenticationManager(InMemoryUserDetailsManager users, PasswordEncoder encoder) {
        var provider = new DaoAuthenticationProvider(users);
        provider.setPasswordEncoder(encoder);
        return new ProviderManager(provider);
    }
}

@RestController
@Profile("!prod")
class TokenController {
    private final AuthenticationManager authentication;
    private final JwtEncoder encoder;

    TokenController(AuthenticationManager authentication, JwtEncoder encoder) {
        this.authentication = authentication;
        this.encoder = encoder;
    }

    record Login(@NotBlank @Size(max = 80) String username, @NotBlank @Size(max = 72) String password) {}
    record Token(String token, long expiresIn) {}

    @PostMapping("/api/token")
    Token login(@Valid @RequestBody Login input) {
        try {
            var user = authentication.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(input.username(), input.password()));
            Instant now = Instant.now();
            var roles = user.getAuthorities().stream().map(role -> role.getAuthority().substring(5)).toList();
            var claims = JwtClaimsSet.builder().issuer(LocalTokens.ISSUER).audience(List.of(LocalTokens.AUDIENCE))
                    .subject(user.getName()).issuedAt(now).expiresAt(now.plusSeconds(900))
                    .claim("roles", roles).build();
            return new Token(encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue(), 900);
        } catch (AuthenticationException error) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants incorrects.");
        }
    }
}
`,
    "src/main/resources/application-prod.properties": `# Profil d’illustration. Prépare le schéma et un fournisseur d’identité.
spring.datasource.url=\${ATELIER_DB_URL}
spring.datasource.username=\${ATELIER_DB_USER}
spring.datasource.password=\${ATELIER_DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.security.oauth2.resourceserver.jwt.issuer-uri=\${ATELIER_ISSUER_URI}
spring.security.oauth2.resourceserver.jwt.audiences=\${ATELIER_API_AUDIENCE:devafrica-atelier-api}
`,
  };
}

export const demoTokenGuide = `
## Jetons de test

Les comptes locaux sont alice, bob et admin, avec le mot de passe
DevAfrica-Local-42 par défaut. Change-le au besoin avec ATELIER_DEMO_PASSWORD.
Chaque jeton dure 15 minutes et la clé locale change au redémarrage.

\`\`\`powershell
$base = 'http://127.0.0.1:8080/api'
function Atelier-Token($name) {
    $body = @{username=$name; password='DevAfrica-Local-42'} | ConvertTo-Json -Compress
    (Invoke-RestMethod -Uri "$base/token" -Method Post -ContentType 'application/json' -Body $body).token
}
$alice = @{Authorization = "Bearer $(Atelier-Token 'alice')"}
$admin = @{Authorization = "Bearer $(Atelier-Token 'admin')"}
\`\`\`

Le profil prod attend un fournisseur d’identité et PostgreSQL. Il coupe
l’émission locale de jetons. Prépare des migrations, la correspondance du
claim roles et un déploiement HTTPS avant de l’utiliser.
`;
