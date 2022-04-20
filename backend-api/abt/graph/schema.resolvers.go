package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"abt/graph/generated"
	"abt/graph/model"
	"context"
	"flag"
	"fmt"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"

	pb "github.com/MobileCreate/pay_pf_abt_cemv/pkg/cemv"
)

const (
	appId = "cemv-api.abt" // abtはnamespace
)

var (
	// リバースプロキシのアドレス
	addr = flag.String("addr", "dev-pay-pf-rp.mcapps.jp:80", "the address to connect to")
)

func (r *mutationResolver) CreateTodo(ctx context.Context, input model.NewTodo) (*model.Todo, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) CreateHello(ctx context.Context, input model.NewHello) (string, error) {
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewCEmvServiceClient(conn)

	ctx, cancel := context.WithTimeout(ctx, 60*time.Second)
	defer cancel()

	ctx = metadata.AppendToOutgoingContext(ctx, "dapr-app-id", appId)
	res, err := c.SayHello(ctx, &pb.HelloRequest{Name: input.Text})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}

	return res.GetMessage(), nil
}

func (r *queryResolver) Todos(ctx context.Context) ([]*model.Todo, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
