module "ecs-service" {
  source  = "app.terraform.io/CailleachInfo/ecs-service/aws"
  version = "1.1.3"

  role = var.role
  environment = var.environment
  country = var.country

  clusterName = var.clusterName
  serviceName = var.serviceName
  revision = var.revision
}
