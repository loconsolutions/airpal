package com.airbnb.airpal.resources;

import com.airbnb.airpal.core.AirpalUser;
import com.airbnb.airpal.core.store.usage.UsageStore;
import com.airbnb.airpal.presto.PartitionedTable;
import com.airbnb.airpal.presto.Table;
import com.airbnb.airpal.presto.hive.HivePartition;
import com.airbnb.airpal.presto.metadata.CatalogCache;
import com.airbnb.airpal.presto.metadata.ColumnCache;
import com.airbnb.airpal.presto.metadata.PreviewTableCache;
import com.airbnb.airpal.presto.metadata.SchemaCache;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.base.Optional;
import com.google.common.base.Predicate;
import com.google.common.collect.FluentIterable;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import io.dropwizard.util.Duration;
import lombok.Data;
import lombok.NonNull;
import org.joda.time.DateTime;
import org.secnod.shiro.jaxrs.Auth;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static com.airbnb.airpal.core.AuthorizationUtil.isAuthorizedRead;

/**
 * Created by shivamaggarwal on 9/28/15.
 */
@Path("/api/catalog")
public class CatalogResource {
    private final CatalogCache catalogCache;

    @Inject
    public CatalogResource(final CatalogCache catalogCache)
    {
        this.catalogCache = catalogCache;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCatalogsUpdates(
            @Auth AirpalUser user)
    {
        final Map<String, List<String>> catalogMap = catalogCache.getCatalogMap();
        final ImmutableList.Builder<Map<String, String>> builder = ImmutableList.builder();

        for (Map.Entry<String, List<String>> entry : catalogMap.entrySet()) {
            String schema = entry.getKey();
            for (String catalog : entry.getValue()) {
                System.out.println(catalog);
//                if (isAuthorizedRead(user, catalog, schema, table)) {
                Map<String, String> map = Maps.newHashMap();
                map.put("catalog", catalog);
                builder.add(map);
//                }
            }
        }

        final ImmutableList<Map<String, String>> catalogs = builder.build();

        return Response.ok(catalogs).build();
    }
}
