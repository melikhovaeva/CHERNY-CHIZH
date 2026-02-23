import html
from collections import defaultdict
from itertools import cycle

import pydot
from django.apps import apps
from django.core.management.base import BaseCommand

CLUSTER_PALETTE = [
    "#E8F5E9",
    "#E3F2FD",
    "#FFF3E0",
    "#F3E5F5",
    "#FFF9C4",
    "#E0F7FA",
    "#FCE4EC",
    "#F1F8E9",
]

CLUSTER_BORDER_PALETTE = [
    "#66BB6A",
    "#42A5F5",
    "#FFA726",
    "#AB47BC",
    "#FFEE58",
    "#26C6DA",
    "#EF5350",
    "#9CCC65",
]

EDGE_STYLES = {
    "fk": {
        "style": "solid",
        "color": "#555555",
        "arrowhead": "normal",
        "penwidth": "1.2",
    },
    "o2o": {
        "style": "dashed",
        "color": "#1565C0",
        "arrowhead": "diamond",
        "penwidth": "1.2",
    },
    "m2m": {
        "style": "dotted",
        "color": "#C62828",
        "arrowhead": "crow",
        "penwidth": "1.4",
    },
}


def _short_type(field):
    """Return a compact type name for a model field."""
    cls_name = type(field).__name__
    replacements = {
        "Field": "",
        "ForeignKey": "FK",
        "OneToOneField": "O2O",
        "ManyToManyField": "M2M",
        "Positive": "+",
        "Small": "Sm",
        "Integer": "Int",
        "Boolean": "Bool",
        "DateTime": "DT",
    }
    for old, new in replacements.items():
        cls_name = cls_name.replace(old, new)
    return cls_name


def _build_html_label(model):
    """Build an HTML-like Graphviz label with model name header and field rows."""
    name = model.__name__
    fields = []
    for f in model._meta.get_fields():
        if f.auto_created and not f.concrete:
            continue
        if f.name in ("id", "pk"):
            continue

        if f.is_relation and f.related_model:
            target = f.related_model.__name__
            kind = _short_type(f)
            fields.append(f"{html.escape(f.name)} : {kind} &#8594; {html.escape(target)}")
        elif hasattr(f, "get_internal_type"):
            fields.append(f"{html.escape(f.name)} : {_short_type(f)}")

    rows = "".join(
        f'<TR><TD ALIGN="LEFT"><FONT POINT-SIZE="10">{f}</FONT></TD></TR>'
        for f in fields
    )

    return (
        f'<<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="6"'
        f' COLOR="#AAAAAA" BGCOLOR="white" STYLE="ROUNDED">'
        f'<TR><TD><B><FONT POINT-SIZE="13">{html.escape(name)}</FONT></B></TD></TR>'
        f'<HR/>'
        f'{rows}'
        f'</TABLE>>'
    )


class Command(BaseCommand):
    help = "Generate an SVG model dependency graph grouped by Django app."

    def add_arguments(self, parser):
        parser.add_argument(
            "--apps",
            nargs="+",
            type=str,
            help="App labels to include (default: all project apps).",
        )
        parser.add_argument(
            "--output",
            default="models_graph.svg",
            help="Output SVG file path.",
        )

    def handle(self, *args, **options):
        included_apps = options["apps"]
        output_file = options["output"]

        all_models = apps.get_models()

        if included_apps:
            models_list = [
                m for m in all_models if m._meta.app_label in included_apps
            ]
        else:
            models_list = list(all_models)

        if not models_list:
            self.stdout.write(self.style.ERROR("No models found"))
            return

        graph = pydot.Dot(
            graph_type="digraph",
            rankdir="LR",
            splines="spline",
            nodesep="0.8",
            ranksep="1.5",
            fontname="Helvetica",
            bgcolor="white",
            pad="0.5",
            concentrate="true",
        )
        graph.set_node_defaults(
            shape="none",
            fontname="Helvetica",
            fontsize="11",
            margin="0",
        )
        graph.set_edge_defaults(fontname="Helvetica", fontsize="9")

        models_by_app = defaultdict(list)
        for model in models_list:
            models_by_app[model._meta.app_label].append(model)

        bg_colors = cycle(CLUSTER_PALETTE)
        border_colors = cycle(CLUSTER_BORDER_PALETTE)

        nodes = {}

        for app_label in sorted(models_by_app):
            bg = next(bg_colors)
            border = next(border_colors)

            cluster = pydot.Cluster(
                app_label,
                label=f"  {app_label}  ",
                style="rounded,filled",
                fillcolor=bg,
                color=border,
                penwidth="2",
                fontname="Helvetica Bold",
                fontsize="14",
                labeljust="l",
                margin="16",
            )

            for model in models_by_app[app_label]:
                node_id = f"{app_label}__{model.__name__}"
                node = pydot.Node(
                    node_id,
                    label=_build_html_label(model),
                    shape="none",
                )
                cluster.add_node(node)
                nodes[model] = node_id

            graph.add_subgraph(cluster)

        for model in models_list:
            for field in model._meta.get_fields():
                if not (field.is_relation and field.related_model):
                    continue
                if field.related_model not in nodes:
                    continue
                if field.auto_created and not field.concrete:
                    if not field.many_to_many:
                        continue

                if field.many_to_many:
                    if field.auto_created:
                        continue
                    style_key = "m2m"
                elif field.one_to_one:
                    style_key = "o2o"
                else:
                    style_key = "fk"

                edge_attrs = dict(EDGE_STYLES[style_key])
                field_name = field.name if hasattr(field, "name") else ""
                edge_attrs["label"] = f"  {field_name}  "
                edge_attrs["fontcolor"] = edge_attrs["color"]

                graph.add_edge(
                    pydot.Edge(
                        nodes[model],
                        nodes[field.related_model],
                        **edge_attrs,
                    )
                )

        try:
            graph.write_svg(output_file)
            self.stdout.write(self.style.SUCCESS(f"Saved to {output_file}"))
        except Exception as error:
            self.stdout.write(self.style.ERROR(str(error)))
