import React, { useState } from 'react';
import { X, Code2, Server, Database, Shield, FileCode, CheckCircle2, Play, Copy, Check } from 'lucide-react';

interface BackendCodeInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendCodeInspector: React.FC<BackendCodeInspectorProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'controllers' | 'services' | 'security' | 'entities' | 'database' | 'pom'>('architecture');
  const [selectedFile, setSelectedFile] = useState<string>('ProductController.java');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets: Record<string, string> = {
    'ProductController.java': `@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Clothing product catalog & multi-attribute filtering")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Page<ProductDTO> products = productService.getProducts(
                categoryId, brand, minPrice, maxPrice, minRating, page, size, sortBy, sortDirection);
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductRequest request) {
        return new ResponseEntity<>(productService.createProduct(request), HttpStatus.CREATED);
    }
}`,

    'OrderService.java': `@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public OrderDTO createOrder(Long userId, OrderRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot checkout an empty shopping bag");
        }

        // 1. Validate and Deduct Inventory Stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // 2. Build Order & OrderItems with Unique Order ID
        Order order = new Order();
        order.setOrderNumber("SC-" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + "-" + (1000 + new Random().nextInt(9000)));
        order.setTrackingNumber("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PLACED);
        ...
        // 3. Clear shopping cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToDTO(orderRepository.save(order));
    }
}`,

    'SecurityConfig.java': `@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> {})
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                .requestMatchers("/api/cart/**", "/api/orders/**").authenticated()
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}`,

    'JwtService.java': `@Service
public class JwtService {
    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claim("userId", userPrincipal.getId())
                .claim("role", userPrincipal.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
}`,

    'Product.java': `@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_category", columnList = "category_id"),
    @Index(name = "idx_product_brand", columnList = "brand"),
    @Index(name = "idx_product_price", columnList = "price")
})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    private List<String> images = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    private List<String> availableSizes = new ArrayList<>();

    @NotNull
    @Min(0)
    private Integer stockQuantity;
}`,

    'schema.sql': `-- MySQL 8.0 Relational DDL for stylecart_db
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(80) NOT NULL,
    category_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories (id),
    INDEX idx_product_category (category_id),
    INDEX idx_product_brand (brand)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;`,

    'pom.xml': `<dependencies>
    <!-- Spring Boot 3 Web, JPA & Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>

    <!-- JJWT 0.12.5 -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
</dependencies>`,
  };

  const getCodeForActiveTab = () => {
    switch (activeTab) {
      case 'controllers':
        return codeSnippets['ProductController.java'];
      case 'services':
        return codeSnippets['OrderService.java'];
      case 'security':
        return codeSnippets['SecurityConfig.java'];
      case 'entities':
        return codeSnippets['Product.java'];
      case 'database':
        return codeSnippets['schema.sql'];
      case 'pom':
        return codeSnippets['pom.xml'];
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span>Java Spring Boot Backend Architecture</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Ready for Placement Interview
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Spring Boot 3.3.0 · Spring Security 6 · JJWT · Hibernate JPA · MySQL 8.0 · Maven
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-neutral-800 bg-neutral-950/60 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'architecture' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Architecture & Layers</span>
          </button>
          <button
            onClick={() => setActiveTab('controllers')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'controllers' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Controllers (REST)</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'services' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Services & Business Logic</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'security' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security & JWT</span>
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'entities' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>JPA Entities</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'database' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL Schema DDL</span>
          </button>
          <button
            onClick={() => setActiveTab('pom')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pom' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>pom.xml</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {activeTab === 'architecture' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-neutral-800/60 border border-neutral-700">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Presentation Layer</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    Spring MVC REST Controllers handling HTTP requests, input validation (<code className="text-amber-300 font-mono">@Valid</code>), OpenAPI Swagger tags, and DTO mappings.
                  </p>
                  <div className="text-[11px] font-mono text-neutral-400 space-y-1">
                    <div>· AuthController.java</div>
                    <div>· ProductController.java</div>
                    <div>· OrderController.java</div>
                    <div>· CartController.java</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-800/60 border border-neutral-700">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Business Service Layer</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    Transactional boundaries (<code className="text-amber-300 font-mono">@Transactional</code>), stock deductions, order lifecycle orchestration, and payment service abstraction.
                  </p>
                  <div className="text-[11px] font-mono text-neutral-400 space-y-1">
                    <div>· OrderService.java</div>
                    <div>· ProductService.java</div>
                    <div>· CartService.java</div>
                    <div>· AuthService.java</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-800/60 border border-neutral-700">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Persistence Layer</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    Spring Data JPA interfaces with derived query methods, multi-attribute filtering with JPQL, and foreign key cascade rules in MySQL 8.0.
                  </p>
                  <div className="text-[11px] font-mono text-neutral-400 space-y-1">
                    <div>· ProductRepository.java</div>
                    <div>· OrderRepository.java</div>
                    <div>· UserRepository.java</div>
                    <div>· CartRepository.java</div>
                  </div>
                </div>
              </div>

              {/* Security & Authentication Breakdown */}
              <div className="p-4 rounded-lg bg-neutral-800/40 border border-neutral-700 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Spring Security 6 & JWT Workflow</span>
                </h3>
                <div className="text-xs text-neutral-300 space-y-2 leading-relaxed">
                  <p>
                    1. <strong>Authentication</strong>: Client sends email and password to <code className="text-amber-300 font-mono">POST /api/auth/login</code>. The <code className="text-amber-300 font-mono">DaoAuthenticationProvider</code> verifies credentials against BCrypt hashed passwords in MySQL.
                  </p>
                  <p>
                    2. <strong>Token Generation</strong>: Upon success, <code className="text-amber-300 font-mono">JwtService</code> crafts a signed HMAC-SHA256 JWT containing user ID, subject email, and authorities (<code className="text-amber-300 font-mono">ROLE_USER</code> or <code className="text-amber-300 font-mono">ROLE_ADMIN</code>).
                  </p>
                  <p>
                    3. <strong>Filter Chain</strong>: Every subsequent authenticated request is intercepted by <code className="text-amber-300 font-mono">JwtAuthenticationFilter</code>, parsing the <code className="text-amber-300 font-mono">Bearer &lt;token&gt;</code> header, validating expiration, and populating <code className="text-amber-300 font-mono">SecurityContextHolder</code>.
                  </p>
                </div>
              </div>

              {/* Project Directory Tree */}
              <div className="p-4 rounded-lg bg-neutral-950 font-mono text-xs text-neutral-300 space-y-1">
                <div className="text-emerald-400 font-bold">stylecart/</div>
                <div className="text-neutral-400">├── backend/</div>
                <div className="text-neutral-400">│   ├── pom.xml (Spring Boot 3, JJWT 0.12.5, MySQL, SpringDoc)</div>
                <div className="text-neutral-400">│   └── src/main/java/com/stylecart/ (controller, service, repository, entity, dto, security, config, exception)</div>
                <div className="text-neutral-400">├── database/</div>
                <div className="text-neutral-400">│   └── schema.sql (Full relational MySQL DDL, foreign keys, indexes, seed data)</div>
                <div className="text-neutral-400">├── Dockerfile & docker-compose.yml</div>
                <div className="text-neutral-400">└── README.md (Comprehensive interview preparation guide)</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  {activeTab === 'controllers' && 'backend/src/main/java/com/stylecart/controller/ProductController.java'}
                  {activeTab === 'services' && 'backend/src/main/java/com/stylecart/service/OrderService.java'}
                  {activeTab === 'security' && 'backend/src/main/java/com/stylecart/config/SecurityConfig.java'}
                  {activeTab === 'entities' && 'backend/src/main/java/com/stylecart/entity/Product.java'}
                  {activeTab === 'database' && 'database/schema.sql'}
                  {activeTab === 'pom' && 'backend/pom.xml'}
                </span>
                <button
                  onClick={() => handleCopy(getCodeForActiveTab())}
                  className="flex items-center gap-1.5 text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-lg bg-neutral-950 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed border border-neutral-800">
                <code>{getCodeForActiveTab()}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
          <span>Backend files created in <strong className="text-white">/backend/</strong>, <strong className="text-white">/database/</strong>, and <strong className="text-white">Dockerfile</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
