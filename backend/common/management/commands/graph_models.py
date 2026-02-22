import pydot
from django.core.management.base import BaseCommand
from django.apps import apps

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            '--apps',
            nargs='+',
            type=str,
        )
        parser.add_argument(
            '--output',
            default='models_graph.svg',
        )

    def handle(self, *args, **options):
        included_apps = options['apps']
        output_file = options['output']

        all_models = apps.get_models()

        if included_apps:
            filtered_models = [
                model for model in all_models if model._meta.app_label in included_apps
            ]

        if not filtered_models:
            self.stdout.write(self.style.ERROR('No models found'))
            return

        graph = pydot.Dot(graph_type='digraph', rankdir='TB', splines='ortho')

        nodes = {}
        for model in filtered_models:
            label = f"{model._meta.app_label}.{model.__name__}"
            node = pydot.Node(
                name=label,
                label=label,
            )
            graph.add_node(node)
            nodes[model] = node

        for model in filtered_models:
            for field in model._meta.get_fields():
                if field.is_relation and field.related_model:
                    if field.related_model in nodes:
                        if field.auto_created and not field.concrete:
                            continue

                        from_node = nodes[model]
                        to_node = nodes[field.related_model]

                        edge = pydot.Edge(from_node, to_node)
                        graph.add_edge(edge)

        try:
            graph.write_svg(output_file)
            self.stdout.write(self.style.SUCCESS(f'Saved to {output_file}'))
        except Exception as error:
            self.stdout.write(self.style.ERROR(str(error)))
