package main

import (
	"context"
	"errors"
	"log"

	"abt/graph"
	"abt/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	// DefaultHTTPGetAddress Default Address
	DefaultHTTPGetAddress = "https://checkip.amazonaws.com"

	// ErrNoIP No IP found in response
	ErrNoIP = errors.New("No IP in HTTP response")

	// ErrNon200Response non 200 status code in response
	ErrNon200Response = errors.New("Non 200 Response found")

	ginLambda *ginadapter.GinLambda
)

// Defining the Graphql handler
func graphqlHandler() gin.HandlerFunc {
	// NewExecutableSchema and Config are in the generated.go file
	// Resolver is in the resolver.go file
	h := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// Defining the Playground handler
func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/graphql/abt/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Printf("request")

	if ginLambda == nil {
		log.Printf("Gin cold start")
		r := gin.Default()

		// ginではCORSを許可。template.yaml側で設定
		r.Use(cors.New(cors.Config{
			AllowAllOrigins: true,
			AllowedMethods:  []string{"GET", "POST", "OPTIONS"},
			AllowedHeaders:  []string{"*"},
		}))

		r.POST("/graphql/abt/query", graphqlHandler())
		r.GET("/graphql/abt/playground", playgroundHandler())
		r.GET("/graphql/abt/ping", func(c *gin.Context) {
			log.Println("Handler!!")
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})

		ginLambda = ginadapter.New(r)
	}

	return ginLambda.ProxyWithContext(ctx, request)
}

func main() {
	lambda.Start(Handler)
}
